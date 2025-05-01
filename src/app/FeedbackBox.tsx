import React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  buttonText = "Submit Feedback"
}) => {
  return (
    <Accordion type="single" collapsible className="w-full border rounded-md">
      <AccordionItem value="item-1">
        <AccordionTrigger className="px-4 py-3">
          <div className="flex flex-col text-left">
            <span className="text-base font-medium text-gray-700">
              Session {sessionLetter}
            </span>
            <span className="text-lg font-semibold text-gray-900">
              {sessionTitle}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <p className="text-base text-gray-600 mb-4">
            {description}
          </p>
          <a
            href={feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-[#733a84] px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-purple-700 transition-colors"
          >
            {buttonText}
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default FeedbackBox
