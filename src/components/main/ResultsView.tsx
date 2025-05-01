import { LineData, SentimentResult } from "@/types/types";
import { ExportReportButton } from "./ExportReportButton";
import { PostItem } from "./PostItem";
import { SentimentLineChart } from "../stats/SentimentLineChart";
import { StatsCard } from "./StatsCard";

export const ResultsView = ({ results, lineData }: { results: SentimentResult; lineData: LineData }) => (
  <div id="sentiment-chart" className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
      <StatsCard
        title="Positive Sentiment"
        value={results.sentiment.positive}
        percentage={Math.round((results.sentiment.positive / results.total) * 100)}
        trend={results.sentiment.positive > 0 ? 'up' : 'down'}
      />
      <StatsCard
        title="Negative Sentiment"
        value={results.sentiment.negative}
        percentage={Math.round((results.sentiment.negative / results.total) * 100)}
        trend={results.sentiment.negative > 0 ? 'down' : 'up'}
      />
      <StatsCard
        title="Neutral Sentiment"
        value={results.sentiment.neutral}
        percentage={Math.round((results.sentiment.neutral / results.total) * 100)}
        trend="meh"
      />
      <div className="flex items-center justify-start p-5 pl-8 rounded-2xl border border-neutral-700 bg-neutral-900/70 hover:bg-neutral-900/50 transition-colors">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-neutral-200">{results.total}</p>
          <p className="text-sm text-neutral-500">Total Analyzed Posts</p>
        </div>
      </div>
    </div>

    <div className="w-full rounded-2xl bg-neutral-900/50 border border-neutral-700">
      <SentimentLineChart data={lineData} />
    </div>

    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Analyzed Posts</h3>
      {results.posts.map((post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </div>

    <ExportReportButton elementId="sentiment-chart" />
  </div>
)