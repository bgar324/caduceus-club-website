import React from 'react';

interface FeedbackBoxProps {
  sessionLetter: string;
  sessionTitle: string;
  description: string;
  feedbackUrl: string;
  buttonText?: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  sessionLetter,
  sessionTitle,
  description,
  feedbackUrl,
  buttonText = "Submit Feedback"
}) => {
  return (
    <div className="rounded-lg border border-gray-200 p-5">
      <h4 className="font-semibold text-lg text-gray-800">Session {sessionLetter}</h4>
      <h4 className="font-medium text-lg text-gray-800 mb-2">{sessionTitle}</h4>
      <p className="text-gray-600 mb-4">{description}</p>
      <a
        href={feedbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block py-2 px-4 bg-[#733a84] text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default FeedbackBox;
