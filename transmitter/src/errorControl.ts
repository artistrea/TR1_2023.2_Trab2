import { z } from "zod";

export const ECSchema = z.enum(["Paridade", "CRC"]);

export type ErrorControlType = z.infer<typeof ECSchema>;

export function getErrorControl(data: string, _errorControlType: ErrorControlType): string {
  
    data = "100100000";
    const polynomial = "1101";


    switch(_errorControlType){
        case "CRC":

        break;
    }
    console.log(9)

    return "";
}
