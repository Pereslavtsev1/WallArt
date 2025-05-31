"use client";

import Header from "./(main-page)/header";

function Home() {
  return (
    <div className="flex h-dvh w-full justify-center bg-background text-foreground">
      <div className="w-full max-w-7xl">
        <Header />
      </div>
    </div>
  );
}

export default Home;
