"use client";

import { useEffect, useState } from "react";

import StartCreationForm from "@/components/form/StartCreationForm";

export default function IslandProductMenu({
  productType,
  skillProcesses,
}: {
  productType: string;
  skillProcesses: any[];
}) {
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const imageMap = {
    "ore": "/image/16-Mining_Wood_Cutting_Planting/Mine_Unlocked.png", 
    "wood":"/image/16-Mining_Wood_Cutting_Planting/Tree_Unlocked.png", 
    "seed":"/image/16-Mining_Wood_Cutting_Planting/Cotton_Unlocked.png",
  } as any ;

  const image_Not_unlocked_Map = {
    "ore": "/image/16-Mining_Wood_Cutting_Planting/Mine_Not_unlocked.png", 
    "wood":"/image/16-Mining_Wood_Cutting_Planting/Tree_Not_unlocked.png", 
    "seed":"/image/16-Mining_Wood_Cutting_Planting/Cotton_Not_unlocked.png",
  } as any ;

  return (
    <div className="w-full h-full grid grid-cols-4 pt-4 gap-4">     
      <p className="relative w-full h-full text-white cursor-pointer bg-no-repeat bg-contain flex flex-col justify-evenly items-center" onClick={() => setModalFlag(true)} style={{padding:"10px",background:`url("/image/16-Mining_Wood_Cutting_Planting/Large_box.png")`,backgroundSize:"100% 100%"}}>
          cut   {productType}  
          <div className="flex w-2/3 justify-evenly">
            10px/<img src="/image/16-Mining_Wood_Cutting_Planting/clock.png" style={{height:"20px",width:"20px"}}/> 3 Seconds
          </div> 
        <img src={imageMap[productType]} style={{width:"80px"}}/> 
        <p>0/500</p>
        <div className="flex justify-center items-center">
          <img src="/image/16-Mining_Wood_Cutting_Planting/trophy.png" style={{height:"20px",width:"20px"}} />
          <img src="/image/16-Mining_Wood_Cutting_Planting/Progressbar_Background.png" style={{height:"10px",width:"80%"}}  />
        </div> 
      </p>

      {[2, 3, 4, 5, 6, 7, 8].map((id) => (
        <p key={id} className="relative w-full h-full text-white cursor-pointer bg-no-repeat bg-contain flex flex-col justify-evenly items-center" style={{padding:"20px",background:`url("/image/16-Mining_Wood_Cutting_Planting/Large_box.png")`,backgroundSize:"100% 100%"}}>
          <div className="text-2xl flex items-center justify-center"><img src="/image/16-Mining_Wood_Cutting_Planting/Lock.png" className="w-[14%]" />Locked</div>
          <img src={image_Not_unlocked_Map[productType]} style={{width:"90px"}}/>
          level 10
        </p>
      ))}

      {modalFlag && (
        <StartCreationForm
          productType={productType}
          skillProcesses={skillProcesses}
          handleCloseModal={() => setModalFlag(false)}
        />
      )}
    </div>
  );
}
