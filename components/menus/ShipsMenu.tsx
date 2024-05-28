"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShipsMenu({ closeShipsMenu }: { closeShipsMenu: () => void }) {
  const [shipsBagBackg, setShipsBagBackg] = useState<boolean>(false);

  const shipsTopData = [
    { id: 0, title: "All" },
    { id: 1, title: "Roster1" },
    { id: 2, title: "Roster2" },
    { id: 3, title: "Roster3" },
    { id: 4, title: "Roster4" },
    { id: 5, title: "Unassigned" },
  ];

  const ships = [
    { id: 1, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
    { id: 2, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
    { id: 3, iconUrl: "/image/Ocean/Boat_big.png", name: "001", ID: "001", HP: "20/20" },
  ];

  const shipInventories = [
    { id: 1, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP ONE" },
    { id: 2, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP TWO" },
    { id: 3, iconUrl: "/image/Ocean/Boat_big.png", name: "SHIP THREE" },
  ];

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-screen flex justify-center items-center" >
      {!shipsBagBackg && (
        <div className="w-full relative flex flex-col  p-12 gap-4" style={{background:`url("/image/11-Ship_management/11.1-11.3Roster/background.png")`,backgroundSize:"100% 100%"}}>
          <div className="absolute right-4 text-6xl text-white cursor-pointer" onClick={closeShipsMenu} style={{top:"20px"}}>
            <img src="/image/11-Ship_management/11.1-11.3Roster/back.png" style={{width:"50px",height:"50px"}}/>
          </div>

          <div className="w-full flex justify-around items-center py-4">
            {shipsTopData.map((data) => (
              <div
                key={data.id}
                className="w-64 h-16 flex justify-center items-center text-white text-3xl cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover"
                style={{background:`url("/image/11-Ship_management/11.1-11.3Roster/SailBtn.png")`,backgroundSize:"100% 100%"}}
              >
                {data.title}
              </div>
            ))}
          </div>

          {ships.map((ship) => (
            <div key={ship.id} className="w-full">
              <div className="w-full flex items-center gap-4"
                style={{background:`url("/image/11-Ship_management/11.1-11.3Roster/Roster.png")`,backgroundSize:"100% 100%",height:"150px"}}
              >
                <div className="relative w-1/6 h-full">
                  <div className="absolute left-1 text-white text-xl">{ship.id}</div>
                  <Image
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    src="/image/Ocean/Boat_big.png"
                    alt="boat-big"
                    width={125}
                    height={100}
                    priority
                  />
                </div>

                <div className="flex-1 h-full text-white p-4 flex items-center">
                  <div >
                    <p>Name: {ship.name}</p>
                    <p>ID: {ship.ID}</p>
                    <p>HP: {ship.HP}</p></div>
                  </div>
                  <div className="text-white flex" style={{height:"100%",padding:"35px 0"}}>
                    <div style={{height:"100%",width:"100px"}} className="relative flex items-center justify-center"><img src="/image/11-Ship_management/11.1-11.3Roster/DEF.png" style={{height:"80%",}} /><p className="absolute" style={{right:"0",bottom:"0",fontSize:"30px"}}>7</p></div>
                    <div style={{height:"100%",width:"100px"}} className="relative flex items-center justify-center"><img src="/image/11-Ship_management/11.1-11.3Roster/ATK.png" style={{height:"80%",}} /><p className="absolute" style={{right:"0",bottom:"0",fontSize:"30px"}}>9</p></div>
                    <div style={{height:"100%",width:"100px"}} className="relative flex items-center justify-center"><img src="/image/11-Ship_management/11.1-11.3Roster/speed.png" style={{height:"80%",}} /><p className="absolute" style={{right:"0",bottom:"0",fontSize:"30px"}}>5</p></div>
                    <div style={{height:"100%",width:"100px"}} className="relative flex items-center justify-center"><img src="/image/11-Ship_management/11.1-11.3Roster/load.png" style={{height:"80%",}} /><p className="absolute" style={{right:"0",bottom:"0",fontSize:"30px"}}>8</p></div>
                  </div>

                <div
                  className="w-1/5 h-full flex relative justify-center items-center text-white text-2xl cursor-pointer"
                  onClick={() => setShipsBagBackg(true)}
                >
                  TransFer<br/> Inventory
                  <img src="/image/11-Ship_management/11.1-11.3Roster/back.png"  className="absolute" style={{right:"30px",top:"18px",width:"30px",height:"30px"}}/>
                </div>
              </div>
            </div>
          ))}

          <div className="w-full flex justify-end items-center gap-4">
            <div className="aspect-[1] text-center text-7xl text-white cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover" style={{background:`url("/image/11-Ship_management/11.1-11.3Roster/addBtn.png")`,backgroundSize:"100% 100%",width:"80px",height:"80px"}}>
              
            </div>

            <div className="w-[144px] h-[70px] flex justify-center items-center text-white text-3xl cursor-pointer bg-btn-frame bg-center bg-no-repeat bg-cover" style={{background:`url("/image/11-Ship_management/11.1-11.3Roster/SailBtn.png")`,backgroundSize:"100% 100%"}}>
              SAIL
            </div>
          </div>
        </div>
      )}

      {shipsBagBackg && (
        <div className="flex justify-between items-center h-full w-[115%] relative">
          {shipInventories.map((inventory) => (
            <div key={inventory.id} className="flex flex-col items-center w-[26%] h-[80%]">
              <div className="flex justify-evenly items-center w-full h-[15%]">
                <div className="w-[120px] h-[120px] bg-btn-frame bg-center bg-no-repeat bg-cover">
                  <Image
                    className="w-full h-full scale-[60%]"
                    src={inventory.iconUrl}
                    alt="inventory-pic"
                    width={120}
                    height={120}
                    priority
                  />
                </div>

                <div className="flex justify-center items-center  bg-center bg-no-repeat bg-cover text-white text-center px-12 py-3" style={{background:`url("/image/11-Ship_management/11.4Equipment_exchange/ship_selection_button.png")`,backgroundSize:"100% 100%"}}>
                  {inventory.name}
                </div>

                {/* {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className="w-[180px] h-[56px] bg-btn-frame bg-center bg-no-repeat bg-cover text-white text-center"
                  >
                    {inventory.name}
                  </div>
                ))} */}
              </div>

              <div className="flex flex-col items-center  p-4 gap-4" style={{background:`url("/image/11-Ship_management/11.4Equipment_exchange/long_background.png")`,backgroundSize:"100% 100%",height:"600px",padding:"60px"}}>
                <div className="text-xl text-white text-center bg-btn-frame bg-center bg-no-repeat bg-cover px-16 py-3" style={{background:`url("/image/11-Ship_management/11.4Equipment_exchange/island_btn.png")`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%"}}>
                  SHIP INVENTORY
                </div>

                <div className="w-full grid gap-3" style={{gridTemplateColumns: "repeat(2, minmax(0, 1fr))",width:"200px",height:"200px"}}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <div key={num} className="w-full aspect-[1] bg-btn-frame bg-center bg-no-repeat bg-cover" />
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div
            className="w-[135px] h-[72px] absolute bottom-10 right-0 text-white flex justify-center items-center text-3xl cursor-pointer bg-center bg-no-repeat bg-cover"
            onClick={() => setShipsBagBackg(false)}
          >
            <img src="/image/11-Ship_management/11.4Equipment_exchange/back_button.png" />            
          </div>
          <div className="absolute"  style={{width:"200px",left:'24%'}}> 
              <img src="/image/11-Ship_management/11.4Equipment_exchange/exchange_button.png"/>
          </div>
          <div className="absolute"  style={{width:"200px",left:'61%'}}> 
              <img src="/image/11-Ship_management/11.4Equipment_exchange/exchange_button.png"/>
          </div>
        </div>
      )}
    </div>
  );
}
