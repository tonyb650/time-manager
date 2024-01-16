import chevron1up from "../../assets/img/chevron-up.svg";

function MoveUp(props) {
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
    <img src={chevron1up} /> Up
  </button>
  )
}

export default MoveUp;