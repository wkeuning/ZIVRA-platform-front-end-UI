import { Button } from "@/components/ui/button";

const FeedbackForm = () => (
  <div className="w-full bg-white border-t border-gray-200 z-50 p-4 rounded-lg mt-4">

    <label className="block text-lg font-semibold mb-2 text-black">Feedback</label>
    <textarea
      className="w-full p-2 border rounded h-24 bg-[#E5E5E5] text-black"
      placeholder="Write your feedback..."
    ></textarea>
    <Button className="w-full bg-[#4C45FC] text-white p-3 rounded-xl">Send</Button>
  </div>
);

export default FeedbackForm;
