import { useEffect, useState } from "react";
import { fetchComments, addComment } from "../api/comments";

export default function Comments({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments(ticketId).then(setComments);
  }, [ticketId]);

  const submit = async (e) => {
    e.preventDefault();
    const comment = await addComment({ ticketId, text });
    setComments([...comments, comment]);
    setText("");
  };

  return (
    <div className="mt-4 border-t pt-3">
      <h3 className="font-semibold mb-2">Comments</h3>

      <div className="space-y-2 mb-3">
        {comments.map(c => (
          <div key={c._id} className="bg-gray-100 p-2 rounded">
            <div className="text-sm font-medium">{c.user.name}</div>
            <div className="text-sm">{c.text}</div>
            <div className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          className="border p-2 flex-1"
          required
        />
        <button className="bg-black text-white px-4">
          Send
        </button>
      </form>
    </div>
  );
}
