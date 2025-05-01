import React from "react"

interface FeedbackBoxProps {
  sessionLetter: string
  sessionTitle: string
  description: string
  feedbackUrl: string
  buttonText?: string
}

const FeedbackBox: React.FC<FeedbackBoxProps> = ({
  sessionLetter,
  sessionTitle,
  description,
  feedbackUrl,
  buttonText = "Submit Feedback",
}) => {
  return (
    <div className="w-full border rounded-md px-4 py-3">
      <div className="flex flex-col text-left mb-3">
        <span className="text-base font-medium text-gray-700">
          Session {sessionLetter}
        </span>
        <span className="text-lg font-semibold text-gray-900">
          {sessionTitle}
        </span>
      </div>
      <p className="text-base text-gray-600 mb-4">{description}</p>
      <a
        href={feedbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md bg-[#733a84] px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
      >
        {buttonText}
      </a>
    </div>
  )
}

export default FeedbackBox
