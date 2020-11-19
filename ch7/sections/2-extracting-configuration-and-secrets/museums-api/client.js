// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("museums/types", [], function (exports_1, context_1) {
  "use strict";
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function () {
    },
  };
});
System.register("museums/controller", [], function (exports_2, context_2) {
  "use strict";
  var Controller;
  var __moduleName = context_2 && context_2.id;
  return {
    setters: [],
    execute: function () {
      Controller = class Controller {
        constructor({ museumRepository }) {
          this.museumRepository = museumRepository;
        }
        async getAll() {
          return this.museumRepository.getAll();
        }
      };
      exports_2("Controller", Controller);
    },
  };
});
System.register("museums/repository", [], function (exports_3, context_3) {
  "use strict";
  var Repository;
  var __moduleName = context_3 && context_3.id;
  return {
    setters: [],
    execute: function () {
      Repository = class Repository {
        constructor() {
          this.storage = new Map();
        }
        async get(id) {
          return this.storage.get(id);
        }
        async getAll() {
          return [...this.storage.values()];
        }
      };
      exports_3("Repository", Repository);
    },
  };
});
System.register(
  "museums/index",
  ["museums/controller", "museums/repository"],
  function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [
        function (controller_ts_1_1) {
          exports_4({
            "Controller": controller_ts_1_1["Controller"],
          });
        },
        function (repository_ts_1_1) {
          exports_4({
            "Repository": repository_ts_1_1["Repository"],
          });
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register("users/types", [], function (exports_5, context_5) {
  "use strict";
  var __moduleName = context_5 && context_5.id;
  return {
    setters: [],
    execute: function () {
    },
  };
});
System.register("client/index", [], function (exports_6, context_6) {
  "use strict";
  var client;
  var __moduleName = context_6 && context_6.id;
  function getClient({ baseURL }) {
    client.baseURL = baseURL;
    return {
      login,
      register,
      getMuseums,
    };
  }
  exports_6("getClient", getClient);
  async function login({ username, password }) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return fetch(`${client.baseURL}/api/login`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers,
    })
      .then(async (r) => {
        return r.json()
          .then((response) => {
            client.loginToken = response.token;
            return response;
          });
      })
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }
  async function register({ username, password }) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return fetch(`${client.baseURL}/api/users/register`, {
      body: JSON.stringify({ username, password }),
      method: "POST",
      headers,
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }
  async function getMuseums() {
    if (!client.loginToken) {
      throw new Error("You need to be logged in to get museums");
    }
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${client.loginToken}`);
    return fetch(`${client.baseURL}/api/museums`, {
      headers,
    })
      .then((r) => r.json())
      .catch((e) => {
        console.error(e);
        throw e;
      });
  }
  return {
    setters: [],
    execute: function () {
      client = {
        baseURL: "",
        loginToken: null,
      };
    },
  };
});

const __exp = __instantiate("client/index", false);
export const getClient = __exp["getClient"];
