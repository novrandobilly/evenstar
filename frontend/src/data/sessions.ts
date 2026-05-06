export type Filter = "all" | "training" | "match";
export type MatchResult = "win" | "loss" | "draw";

export interface TrainingMetric {
  label: string;
  percentage: number;
}

export interface TrainingSubsession {
  id: string;
  type: "training";
  title?: string;
  metrics: TrainingMetric[];
}

export interface MatchSet {
  ours: number;
  theirs: number;
}

export interface MatchOpponent {
  opponentNames: string[]; // 1 for singles, 2 for doubles
  yourPartner?: string; // optional, your partner name for doubles
}

export interface MatchSubsession {
  id: string;
  type: "match";
  opponent: MatchOpponent;
  event: "Singles" | "Doubles";
  result: MatchResult;
  sets: MatchSet[];
}

export type Subsession = TrainingSubsession | MatchSubsession;

export interface Session {
  id: string;
  title: string;
  date: string;
  duration: string;
  subsessions: Subsession[];
}

export const sessions: Session[] = [
  {
    id: "1",
    title: "League Night",
    date: "2025-04-24",
    duration: "2h 10m",
    subsessions: [
      {
        id: "1-s1",
        type: "match",
        opponent: { opponentNames: ["Marcus Hill"] },
        event: "Singles",
        result: "win",
        sets: [
          { ours: 6, theirs: 3 },
          { ours: 4, theirs: 6 },
          { ours: 7, theirs: 5 },
        ],
      },
      {
        id: "1-s2",
        type: "training",
        title: "Warmup",
        metrics: [
          { label: "Serve", percentage: 72 },
          { label: "Forehand", percentage: 68 },
          { label: "Backhand", percentage: 64 },
        ],
      },
      {
        id: "1-s3",
        type: "match",
        opponent: { opponentNames: ["Lee", "Park"], yourPartner: "Parker" },
        event: "Doubles",
        result: "draw",
        sets: [{ ours: 6, theirs: 6 }],
      },
    ],
  },
  {
    id: "2",
    title: "Baseline Mechanics",
    date: "2025-04-22",
    duration: "1h 30m",
    subsessions: [
      {
        id: "2-s1",
        type: "training",
        title: "Baseline",
        metrics: [
          { label: "Forehand", percentage: 81 },
          { label: "Backhand", percentage: 76 },
          { label: "Footwork", percentage: 73 },
        ],
      },
      {
        id: "2-s2",
        type: "training",
        title: "Approach",
        metrics: [
          { label: "Approach", percentage: 70 },
          { label: "Volley", percentage: 67 },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Serve + Match Block",
    date: "2025-04-20",
    duration: "2h 00m",
    subsessions: [
      {
        id: "3-s1",
        type: "match",
        opponent: { opponentNames: ["Sara Kovac"] },
        event: "Singles",
        result: "loss",
        sets: [
          { ours: 3, theirs: 6 },
          { ours: 5, theirs: 7 },
        ],
      },
      {
        id: "3-s2",
        type: "training",
        title: "Serve",
        metrics: [
          { label: "1st Serve", percentage: 68 },
          { label: "Kick Serve", percentage: 62 },
        ],
      },
      {
        id: "3-s3",
        type: "match",
        opponent: { opponentNames: ["Kim Navarro"] },
        event: "Singles",
        result: "win",
        sets: [{ ours: 6, theirs: 2 }],
      },
    ],
  },
  {
    id: "4",
    title: "Doubles Rotation",
    date: "2025-04-14",
    duration: "1h 35m",
    subsessions: [
      {
        id: "4-s1",
        type: "match",
        opponent: { opponentNames: ["Chen", "Park"], yourPartner: "Jordan" },
        event: "Doubles",
        result: "win",
        sets: [
          { ours: 6, theirs: 4 },
          { ours: 6, theirs: 2 },
        ],
      },
      {
        id: "4-s2",
        type: "match",
        opponent: {
          opponentNames: ["Nakamura", "Diaz"],
          yourPartner: "Parker",
        },
        event: "Doubles",
        result: "draw",
        sets: [{ ours: 7, theirs: 7 }],
      },
    ],
  },
  {
    id: "5",
    title: "Mental Toughness",
    date: "2025-04-07",
    duration: "1h",
    subsessions: [
      {
        id: "5-s1",
        type: "training",
        title: "Mental",
        metrics: [
          { label: "Focus", percentage: 74 },
          { label: "Composure", percentage: 71 },
          { label: "Decision", percentage: 69 },
        ],
      },
    ],
  },
];

export const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Training", value: "training" },
  { label: "Matches", value: "match" },
];

export function isTrainingSubsession(
  subsession: Subsession,
): subsession is TrainingSubsession {
  return subsession.type === "training";
}

export function isMatchSubsession(
  subsession: Subsession,
): subsession is MatchSubsession {
  return subsession.type === "match";
}

export function summarizeRecord(matches: MatchSubsession[]) {
  const wins = matches.filter((match) => match.result === "win").length;
  const losses = matches.filter((match) => match.result === "loss").length;
  const draws = matches.filter((match) => match.result === "draw").length;
  return `${wins}W-${draws}D-${losses}L`;
}

export function formatSets(sets: MatchSet[]) {
  return sets.map((set) => `${set.ours}-${set.theirs}`).join(" / ");
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getSessionById(sessionId: string) {
  return sessions.find((session) => session.id === sessionId);
}
