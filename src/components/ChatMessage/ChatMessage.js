import React, { useState } from "react";
import "./ChatMessage.css"; // ייבוא קובץ ה-CSS
import CourseCard from "../CourseCard/CourseCard";

const ChatMessage = React.memo(({ value, type, onOptionClick, isFullScreen = false }) => {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const getClassName = (type) => {
    switch (type) {
      case "user":
        return "chat-message-user";
        case "optionSelected":
        return "chat-message-user";
      case "bot":
        return "chat-message-bot";
      case "file":
        return "chat-message-link";
      case "options":
        return "chat-message-options";
      case "courses":
        return "chat-message-course";
      default:
        return "";
    }
  };

  return (
    <div className={`chat-message ${getClassName(type)}`}>
      {value && type === "file" ? (
        <>

          <a href={value.url} download={value.name}>
            <img src='../pdf.svg' alt='vector' />
            {value.name}
          </a></>
        // <a href={value} target="_blank" rel="noopener noreferrer">
        //     {value}
        // </a>
      ) : type === "options" && value?.options?.length > 0 ? (
        <div className="options-container">
          <div className="options-question">{value.header}</div>
          <div className="options-list">
            {value.options.map((option, index) => (
              <button key={option.key} className="option-button" onClick={() => onOptionClick(option)}>
                {option.value}
              </button>
            ))}
          </div>
        </div>
      ) : type === "courses" ? (
        (() => {
          const maxVisible = showAllCourses ? value.courses.length : (isFullScreen ? 14 : 6);
          const hasMoreCourses = value.courses.length > (isFullScreen ? 14 : 6);

          return (
            <>
              {value.courses.slice(0, maxVisible).map((course, index) => (
                <CourseCard
                  key={index}
                  name={course.name}
                  IsOpenReg={course.IsOpenReg}
                  props={course.props}
                />
              ))}

              {/* הצגת כפתור "הצג עוד" / "הצג פחות" */}
              {hasMoreCourses && (
                <div className="show-more">
                <button className="show-more-button" onClick={() => setShowAllCourses(!showAllCourses)}>
                  {showAllCourses ? "הצג פחות" : "הצג עוד"}
                </button></div>
              )}
            </>
          );
        })()
      ) : type === "bot" ? (
        <span>
          <div className="header">פולה היועצת הדיגיטלית</div>
          {value}
        </span>
     ) : type === "optionSelected" ? (
      <span>
        {value.value}
      </span>
    )
      :(
        <span>
          {value}
        </span>
      )
      }
    </div>
  );
});

export default ChatMessage;
