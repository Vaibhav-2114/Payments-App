import React, { useEffect, useState } from "react";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get("/api/user/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser({
          firstname: response.data?.user?.firstname ?? "",
          lastname: response.data?.user?.lastname ?? "",
        });
      } catch (error) {
        console.log(error);
      }
    }

    getUser();
  }, []);

  return (
    <div>
      <div className="flex justify-between px-40 py-3 w-full">
        <h2 className="pt-2 pl-5 font-extrabold">Payments App</h2>
        <div className="w-50 flex justify-center gap-2">
          <div className="pt-2">Hello, {user.firstname}</div>
          <div className="relative group">
            <button type="button" aria-label="Open account menu" className="rounded-full bg-red-500 w-10 h-10 text-center hover:border">
              {user.firstname.charAt(0).toUpperCase()}
            </button>

            <div className="absolute right-0 top-full z-10 hidden w-100 pt-2 group-hover:block group-focus-within:block" >
              <div className="rounded-md border bg-white p-4 shadow-lg">
                <div className="flex flex-col items-center gap-3 border-b pb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                    {user.firstname.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="font-semibold">
                      {user.firstname} {user.lastname}
                    </div>
                  </div>
                </div>

                {/* Need to change the onClick*/}
                <button type="button" className="mt-3 block text-center w-full rounded px-2 py-2 hover:bg-gray-100">
                  Change Password
                </button>

                <button type="button" onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/signin";
                }} className="block w-30 m-auto mt-3 rounded px-2 py-2 text-center text-white bg-red-500 hover:bg-red-700">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default Navbar;
