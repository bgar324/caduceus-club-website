import React from 'react';

interface FeedbackBoxProps {
  title: string;
  description: string;
  feedbackUrl: string;
  buttonText?: string;
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  title,
  description,
  feedbackUrl,
  buttonText = "Submit Feedback"
}) => {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 p-5">
      <h4 className="font-medium text-lg text-gray-800 mb-2">{title}</h4>
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
