function ShowCase() {
  return (
    <>
      <div className="flex py-6 px-4 gap-4 overflow-hidden">
        <div className="relative flex-1 overflow-hidden rounded-3xl">
          <img
            src="/assets/ShowCase_1.png"
            className="h-full tansition-transform duration-500 hover:scale-115"
          ></img>
          <h1 className="text-primary-foreground absolute bottom-1/2 left-1/5 text-4xl justify-center align-center font-serif">
            Summer Tavel Essentials
          </h1>
          <button className="absolute bottom-1/35 left-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[6%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Men
          </button>
          <button className="absolute bottom-1/35 right-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[3%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Women
          </button>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-3xl">
          <img
            src="/assets/ShowCase_2.png "
            className="h-full tansition-transform duration-500 hover:scale-115"
          ></img>
          <h1 className="text-primary-foreground absolute bottom-1/2 left-1/3 text-4xl justify-center align-center font-serif">
            New Arrivals
          </h1>
          <button className="absolute bottom-1/35 left-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[4%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Men
          </button>
          <button className="absolute bottom-1/35 right-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[3%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Women
          </button>
        </div>
        <div className="relative flex-1 overflow-hidden rounded-3xl">
          <img
            src="/assets/ShowCase_3.png"
            className="h-full tansition-transform duration-500 hover:scale-115"
          ></img>
          <h1 className="text-primary-foreground absolute bottom-1/2 left-1/5 text-4xl justify-center align-center font-serif ">
            Fresh Colors For Summer
          </h1>
          <button className="absolute bottom-1/35 left-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[4%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Men
          </button>
          <button className="absolute bottom-1/35 right-1/15 text-[90%] text-primary-foreground border border-white border-solid px-[3%] py-[1%] rounded-full w-[40%] transition-all duration-350 hover:bg-primary-foreground hover:text-secondary-foreground">
            Shop Women
          </button>
        </div>
      </div>
      <div className="flex px-6 py-2 max-auto gap-10">
        <div className="flex-1 bg-primary-foreground px-4 py-6 rounded-2xl">
          <p className="text-sm py-4 font-stretch-extra-expanded tracking-widest">
            WEAR ALL DAY COMFORT
          </p>
          <p className="text-sm tracking-widest">
            Lightweight, bouncy, and wildly comfortable, Allbirds shoes make any
            outing feel effortless. Slip in, lace up, or slide them on and enjoy
            the comfy support.
          </p>
        </div>
        <div className="flex-1 bg-primary-foreground px-4 py-6 rounded-2xl">
          <p className="text-sm py-4 font-stretch-extra-expanded tracking-widest">
            SUSTAINABILITY IN EVERY STEP
          </p>
          <p className="text-sm tracking-widest">
            From materials to transport, we’re working to reduce our carbon
            footprint to near zero. Holding ourselves accountable and striving
            for climate goals isn’t a 30-year goal—it’s now.
          </p>
        </div>
        <div className="flex-1 bg-primary-foreground px-4 py-6 rounded-2xl">
          <p className="text-sm py-4 font-stretch-extra-expanded tracking-widest">
            MATERIAL FROM THE EARTH
          </p>
          <p className="text-sm tracking-widest">
            We replace petroleum-based synthetics with natural alternatives
            wherever we can. Like using wool, tree fiber, and sugarcane. They’re
            soft, breathable, and better for the planet—win, win, win.
          </p>
        </div>
      </div>
    </>
  );
}

export default ShowCase;
