import React from "react"
import PropTypes from "prop-types"

const HelloWorld = (props) => {
  return (
    <div className="greeting">
      Greetingwefwunisss: {props.greeting}
    </div>
  )
}

HelloWorld.propTypes = {
  greeting: PropTypes.string
};

export default HelloWorld
