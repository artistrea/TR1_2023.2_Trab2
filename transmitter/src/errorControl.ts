import { z } from "zod";

export const ECSchema = z.enum(["Paridade", "CRC"]);

export type ErrorControlType = z.infer<typeof ECSchema>;

export function addTrailer(data: string, _errorControlType: ErrorControlType): string {
  
    data = "100100000";
    let data_trailer : string = data;
    let trailer : string;
    
    switch(_errorControlType){
        case "CRC":
            const polynomial = "1101";
            
            trailer = ""
        break;
        case "Paridade":

            trailer = ""
        break;
        }
    data_trailer += trailer 
    console.log(9)

    return data_trailer;
}
