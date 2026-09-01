"use client";

import Button from "../../components/button/button";
import Input from "../../components/input/input";
import { useState } from "react";

const Actions = () => {
  const [name, setName] = useState("");

  return (
    <div className="mx-2">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight">
        Actions
      </h1>
      <Input
        id="name"
        label="Name"
        type="text"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
      />
      <Button onClick={() => alert(`Hello, ${name}!`)}>Click Me</Button>
    </div>
  );
};

export default Actions;
