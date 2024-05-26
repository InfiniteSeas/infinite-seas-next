"use server";

import axios from "axios";

export async function getUserInfo({ owner }: { owner: string }) {
  return await axios.get(`http://{domin:port}/api/Players?owner=${owner}`);
}
