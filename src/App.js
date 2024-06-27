import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];



export default function App() {

  const [showAddFriendForm, setShowAddFriendForm] = useState(false);

  const [selectedFriend, setSelectedFriend] = useState(null);

  function selectFriendBtnEvent(friend) {
    setSelectedFriend(selectedFriend?.id === friend?.id ? null : friend);
    setShowAddFriendForm(false);
  }

  function addFriendFormBtnEvent() {
    setShowAddFriendForm((show) => (!show));
    // setSelectedFriend(null);
  }

  const [friends, setfriends] = useState(initialFriends);

  function newFriendsArray(Friend) {
    setfriends((friends) => ([...friends, Friend]));

    setShowAddFriendForm(false);
  };

  function debtHandler(value) {

    setfriends(friends => friends.map((friend) => (friend?.id === selectedFriend?.id ? { ...friend, balance: friend.balance + value } : friend)));


  }

  return <div className="app">
    <div className="sidebar">
      <FriendList friends={friends} setfriends={setfriends} selectFriendBtnEvent={selectFriendBtnEvent} selectedFriend={selectedFriend} />
      {showAddFriendForm && <AddFriendForm newFriendsArray={newFriendsArray} />}
      <Button onClick={addFriendFormBtnEvent} >{showAddFriendForm ? "Close" : "Add friend"}</Button>
    </div>
    {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} debtHandler={debtHandler} />}
  </div>
}

function FriendList({ friends, setfriends, selectFriendBtnEvent, selectedFriend }) {


  // const friends = initialFriends;
  return <ul >
    {friends.map((friend) => <Friend friend={friend} key={friend.id} selectFriendBtnEvent={selectFriendBtnEvent} selectedFriend={selectedFriend} />)}
  </ul>
}

function Button({ children, onClick }) {
  return <button className="button" onClick={onClick}>{children}</button>
}

function Friend({ friend, selectFriendBtnEvent, selectedFriend }) {

  const isSelected = selectedFriend?.id === friend?.id;

  return <div>
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance > 0 ? <p className="green"> you owe {friend.name} {friend.balance}$</p> : ""}
      {friend.balance < 0 ? <p className="red">{friend.name} owes you {Math.abs(friend.balance)}$</p> : ""}
      {friend.balance === 0 ? <p>you and {friend.name} are even</p> : ""}
      <Button onClick={() => selectFriendBtnEvent(friend)}>{isSelected ? "Close" : "select"} </Button>
    </li>

  </div>
}

////////////////////
function AddFriendForm({ newFriendsArray }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");

  function handelAddFriendForm(e) {
    e.preventDefault()

    if (!name || !image) return;

    const id = new Date().getTime() - Math.floor(Math.random() * 1000000);

    const newFriend = {
      id,
      name,
      image: `${image}${id}`,
      balance: 0,
    };

    newFriendsArray(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=");
  }


  return <form className="form-add-friend" onSubmit={handelAddFriendForm}>
    <label>Friend name</label>
    <input type="text" value={name} onChange={(e) => (setName(e.target.value))} />

    <label>Friend's image URL</label>
    <input type="text" value={image} onChange={(e) => (setImage(e.target.value))} />
    <Button>Add</Button>
  </form>
}
/////////////////////


function FormSplitBill({ selectedFriend, debtHandler }) {

  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const friendExpense = bill ? Number(bill - yourExpense) : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function splitBillEvent(e) {
    e.preventDefault();

    if (!bill || !yourExpense) return;

    debtHandler(whoIsPaying === "user" ? -friendExpense : yourExpense);

  };

  return <form className="form-split-bill" onSubmit={splitBillEvent} >
    <h2>Split a bill with {selectedFriend.name}</h2>
    <label>Bill value</label>
    <input type="number" value={bill} onChange={(e) => (setBill(Number(e.target.value)))} />

    <label>Your expense</label>
    <input type="number" value={yourExpense} onChange={(e) => setYourExpense(Number(e.target.value) > bill ? yourExpense : Number(e.target.value))} />

    <label>{selectedFriend.name}'s expense</label>
    <input type="number" disabled value={friendExpense} />

    <label>Who is paying the bill</label>
    <select value={whoIsPaying} onChange={(e) => (setWhoIsPaying(e.target.value))}>
      <option value="user">You</option>
      <option value='friend'>{selectedFriend.name}</option>
    </select>

    <Button>Split bill</Button>


  </form>
}

