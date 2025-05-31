import React from "react";
import "./CourseCard.css"; // ייבוא קובץ ה-CSS

const CourseCard = ({ name, IsOpenReg, props }) => {
  return (
    <div className="course-card">
      <div className="course-header">
        <div className="status">

          {IsOpenReg && (
            <>
              <img className="clock" src='../icon time.svg' alt='clock' />
              <span>רישום פתוח</span>
            </>
          )}
          <img className="fav" src='../Vector.svg' alt='vector' />
        </div>

      </div>
      <h2 className="course-name">{name}</h2>
      <div className="course-props">
        {props.map((prop, index) => (
          <React.Fragment key={index}>
            <span className="course-prop">{prop}</span>
            {index < props.length - 1 && <span className="divider">|</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
