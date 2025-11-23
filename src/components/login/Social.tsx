"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      {/* <Button
        size="lg"
        className="w-full border-none bg-[var(--clr-google)] hover:bg-red-400"
        variant="outline"
        onClick={() => {}}
      >
        <FcGoogle />
      </Button>
      <Button
        size="lg"
        className="w-full border-none bg-[var(--clr-linkedin)] hover:bg-[#0077b5]/80"
        variant="outline"
        onClick={() => {}}
      >
        <FaLinkedinIn size={12} className="text-2xl w-12 h-12" />
      </Button> */}
    </div>
  );
};

export default Social;
