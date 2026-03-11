import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import SourceBadge from "./SourceBadge";

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="border border-border rounded-lg bg-surface hover:border-accent/50 transition-colors group">
      <div className="terminal-header">
        <div className="terminal-dot terminal-dot-red" />
        <div className="terminal-dot terminal-dot-yellow" />
        <div className="terminal-dot terminal-dot-green" />
        <span className="text-text-secondary text-xs font-mono ml-2">
          {post.date}
          {post.lastUpdated && (
            <span className="text-accent-green ml-2">
              actualizado {post.lastUpdated}
            </span>
          )}
        </span>
      </div>
      <div className="p-5">
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-mono font-semibold text-lg text-text-primary group-hover:text-accent transition-colors mb-2">
            {post.title}
          </h2>
        </Link>
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.sources.map((source) => (
            <SourceBadge key={source} name={source} />
          ))}
        </div>
      </div>
    </article>
  );
}
