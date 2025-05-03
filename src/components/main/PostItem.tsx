import { FC } from 'react'
import { PostItemProps } from '@/types/types'
import { User, Hash, ArrowUp, MessageCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export const PostItem: FC<PostItemProps> = ({ post }) => (
  <div className="relative p-4 rounded-lg bg-neutral-900/70 border border-neutral-700 hover:border-neutral-800 transition-colors flex flex-col md:flex-row flex-wrap gap-4">

    <div
      className={`w-2 rounded-full ${post.sentiment === 'positive' ? 'bg-emerald-600' :
          post.sentiment === 'negative' ? 'bg-rose-600' : 'bg-sky-600'
        }`}
    />

    <div className="flex-1 flex flex-col">
      <div className='w-full flex items-start justify-between gap-4 mb-2'>
        <Link
          href={post.url}
          target="_blank"
          className="font-medium mb-2 hover:underline line-clamp-2"
        >
          {post.title}
        </Link>

        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${post.sentiment === 'positive' ? 'bg-green-900/30 text-emerald-400' :
              post.sentiment === 'negative' ? 'bg-red-900/30 text-rose-400' : 'bg-blue-900/30 text-sky-400'
            }`}
        >
          {post.sentiment}
        </span>
      </div>
      <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
        {post.content.substring(0, 256)}{`...more`}
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-400 text-sm">
        <div className="flex items-center gap-2"><User size={14} /><span>{post.author}</span></div>
        <div className="flex items-center gap-2"><Hash size={14} /><span>r/{post.subreddit}</span></div>
        <div className="flex items-center gap-2"><ArrowUp size={14} /><span>{post.upvotes.toLocaleString()}</span></div>
        <div className="flex items-center gap-2"><MessageCircle size={14} /><span>{post.comments.toLocaleString()}</span></div>
        <div className="flex items-center gap-2"><Clock size={14} /><span>{new Date(post.created_utc * 1000).toLocaleString('en-US', { timeZone: 'UTC' })}</span></div>
      </div>
    </div>
  </div>
)
