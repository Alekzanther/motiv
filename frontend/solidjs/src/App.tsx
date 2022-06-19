import { createClient } from "@urql/core";
import { Navigate, NavLink, Route, Routes } from "solid-app-router";
import type { Component } from "solid-js";
import Feed from "./pages/Feed";

const gqlClient = createClient({ url: "http://0.0.0.0:5000/graphql" });

const App: Component = () => {
  return (
    <div class="drawer drawer-mobile">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col ">
        <div class="navbar sticky top-0 z-10 drop-shadow bg-base-100">
          <div class="flex-1">
            <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">
              ...
            </label>
            <a class="btn btn-ghost normal-case text-xl lg:hidden">Motiv</a>
          </div>
          <div class="flex-none gap-2">
            <div class="form-control">
              <input type="text" placeholder="Search" class="input input-bordered" />
            </div>
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img src="https://api.lorem.space/image/face?hash=33791" />
                </div>
              </label>
              <ul
                tabindex="0"
                class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a class="justify-between">
                    Profile
                    <span class="badge">New</span>
                  </a>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Routes>
          <Route path="/">
            <Navigate href="/feed" />
          </Route>
          <Route path="/feed" element={<Feed client={gqlClient} />} />
        </Routes>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-2" class="drawer-overlay"></label>
        <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <li>
            <NavLink href="/feed">Feed</NavLink>
          </li>
          <li>
            <NavLink href="/albums">Albums</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default App;
