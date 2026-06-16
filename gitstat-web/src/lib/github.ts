export interface CommitStats {
  totalCommits: number;
  linesAdded: number;
  linesDeleted: number;
  reposCount: number;
  branchesCount: number;
  lastUpdated: string;
}

export interface GitHubActor {
  login: string;
  avatar_url: string;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  actor: GitHubActor;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: {
    size?: number;
    distinct_size?: number;
    ref?: string;
    head?: string;
    before?: string;
  };
}

const BASE_URL = 'https://api.github.com';

export async function fetchStats(username: string): Promise<{ stats: CommitStats; actor: GitHubActor }> {
  const eventsResponse = await fetch(`${BASE_URL}/users/${username}/events/public`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'GitStat-Web/1.0',
    },
    next: { revalidate: 300 } // Cache for 5 minutes
  });

  if (!eventsResponse.ok) {
    if (eventsResponse.status === 404) throw new Error('User not found');
    if (eventsResponse.status === 403) throw new Error('Rate limit exceeded. Try again later.');
    throw new Error('Failed to fetch user events');
  }

  const events: GitHubEvent[] = await eventsResponse.json();
  if (events.length === 0) {
    // If no events, still try to fetch user profile to return actor
    const userRes = await fetch(`${BASE_URL}/users/${username}`);
    const user: GitHubActor = await userRes.json();
    return {
      actor: user,
      stats: {
        totalCommits: 0,
        linesAdded: 0,
        linesDeleted: 0,
        reposCount: 0,
        branchesCount: 0,
        lastUpdated: new Date().toISOString()
      }
    };
  }

  const actor = events[0].actor;
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  let totalCommits = 0;
  let linesAdded = 0;
  let linesDeleted = 0;
  const uniqueRepos = new Set<number>();
  const uniqueBranches = new Set<string>();

  // To avoid hitting rate limits too hard, we limit the number of compare calls
  // for a single request. In a real app, we'd use a token or a backend proxy with caching.
  const pushEvents = events.filter(e => 
    e.type === 'PushEvent' && 
    new Date(e.created_at) >= twentyFourHoursAgo &&
    e.payload?.head && e.payload?.before
  ).slice(0, 10); // Limit to last 10 pushes for safety in public API

  for (const event of pushEvents) {
    const { head, before, ref } = event.payload!;
    const isInitialPush = before === '0000000000000000000000000000000000000000';
    const compareUrl = isInitialPush
      ? `${BASE_URL}/repos/${event.repo.name}/commits/${head}`
      : `${BASE_URL}/repos/${event.repo.name}/compare/${before}...${head}`;

    try {
      const res = await fetch(compareUrl, {
        headers: {
          'Accept': 'application/vnd.github+json',
          'User-Agent': 'GitStat-Web/1.0',
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (isInitialPush) {
          totalCommits += 1;
          linesAdded += data.stats?.additions || 0;
          linesDeleted += data.stats?.deletions || 0;
        } else {
          totalCommits += data.total_commits || 0;
          data.files?.forEach((file: any) => {
            linesAdded += file.additions;
            linesDeleted += file.deletions;
          });
        }
        uniqueRepos.add(event.repo.id);
        uniqueBranches.add(`${event.repo.name}:${ref}`);
      }
    } catch (e) {
      console.error(`Failed to fetch compare data for ${event.repo.name}`, e);
    }
  }

  return {
    actor,
    stats: {
      totalCommits,
      linesAdded,
      linesDeleted,
      reposCount: uniqueRepos.size,
      branchesCount: uniqueBranches.size,
      lastUpdated: new Date().toISOString()
    }
  };
}
