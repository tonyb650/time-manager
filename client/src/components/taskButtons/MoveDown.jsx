import chevron1down from "../../assets/img/chevron-down.svg";

function MoveDown(props) {
  const { task, index } = props;

  function handleClick(){
    console.log("clicked")
  }

  return (
    <button
      className="btn btn-sm btn-light mb-1"
      onClick={handleClick}
      value={task._id}
    >
    <img src={chevron1down} /> Down
  </button>
  )
}

export default MoveDown;