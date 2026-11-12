import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [friends, setFriends] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [friendUsername, setFriendUsername] = useState("");
  const [modalError, setModalError] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  async function getBalance() {
    const response = await axios.get("/api/account/balance", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setBalance(response.data.balance);
  }

  async function addMoney() {
    const response = await axios.get("/api/account/addmoney", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setBalance(response.data.balance);
  }

  async function getFriends() {
    const response = await axios.get("/api/friends/getfriends", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const names = response.data.friends.map((f) => f.username);
    setFriends(names);
  }

  async function addUser() {
    try {
      setModalError("");

      // Step 1: Look up the user by username to get their ID
      const searchResponse = await axios.get("/api/user/search", {
        params: { username: friendUsername },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const friendId = searchResponse.data.user.id;

      // Step 2: Add the friend using their ID
      await axios.post(
        "/api/friends/addfriend",
        { friendId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setModalType(null);
      setFriendUsername("");
      setModalError("");
      getFriends();
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setModalError(message);
    }
  }

  async function sendMoney() {
    const transferAmount = Number(amount);

    if (!Number.isFinite(transferAmount) || transferAmount <= 0) {
      setModalError("Enter an amount greater than 0.");
      return;
    }

    try {
      setSending(true);
      setModalError("");

      const searchResponse = await axios.get("/api/user/search", {
        params: { username: friendUsername },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await axios.post(
        "/api/account/transfer",
        {
          toUserID: searchResponse.data.user.id,
          amount: transferAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setBalance(response.data.balance);
      setModalType(null);
      setFriendUsername("");
      setAmount("");
    } catch (error) {
      setModalError(
        error.response?.data?.message || "Unable to send money.",
      );
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    getBalance();
    getFriends();
  }, []);

  return (
    <>
      <div>
        <Navbar />
        <div className="w-full mt-10">
          <div className="px-60">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <div className="font-bold">Your Balance:</div>
                <div>${balance}</div>
              </div>
              <div>
                <button
                  onClick={addMoney}
                  className="bg-black text-white p-2 px-5 rounded-lg mr-200"
                >
                  Add Money
                </button>
              </div>
            </div>

            <div className="flex justify-between mt-10 mb-2">
              <p className="font-semibold">Users</p>
              <button
                onClick={() => {
                  setModalError("");
                  setModalType("add");
                }}
                className="bg-black p-1 px-5 rounded-lg text-white"
              >
                Add User
              </button>
            </div>

            <input
              type="text"
              placeholder="Search Users..."
              className="w-full border border-slate-300 p-2"
            />

            <div className="flex flex-col space-y-2 mt-4">
              {friends.map((name, index) => (
                <div
                  key={index}
                  className="flex justify-between h-10 items-center"
                >
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-red-500 w-8 h-8 flex items-center justify-center text-black p-4 text-sm">
                      {name[0].toUpperCase()}
                    </span>
                    <span>{name}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        setFriendUsername(name);
                        setAmount("");
                        setModalError("");
                        setModalType("send");
                      }}
                      className="bg-black text-white h-10 w-30 rounded-xl"
                    >
                      Send Money
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay for add user */}
      {modalType === "add" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setModalType(null);
            setModalError("");
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-96 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Add a Friend</h2>
            <input
              type="text"
              placeholder="Enter username..."
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 mb-4"
            />
            {modalError && (
              <p className="text-red-500 text-sm mb-4">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setModalType(null);
                  setFriendUsername("");
                  setModalError("");
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={addUser}
                className="px-4 py-2 rounded-lg bg-black text-white"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay for sending money */}
      {modalType === "send" && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setModalType(null);
            setModalError("");
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-96 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Send to {friendUsername}</h2>
            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 mb-4"
            />
            {modalError && (
              <p className="text-red-500 text-sm mb-4">{modalError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setModalType(null);
                  setFriendUsername("");
                  setAmount("");
                  setModalError("");
                }}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={sendMoney}
                disabled={sending}
                className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Money"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
