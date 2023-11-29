import { z } from "zod";

export const ECSchema = z.enum(["Bit de paridade par", "CRC"]);

export type ErrorControlType = z.infer<typeof ECSchema>;

export function addTrailer(data: string, errorControlType: ErrorControlType): string {
  
    data = "100100000";
    let dataTrailer : string;
    let trailer : string="";
    
    switch(errorControlType){
        case "CRC":
            const polynomial = "1101";
            // const polynomial = "11101101101110001000001100100000"; 
            // https://edisciplinas.usp.br/pluginfile.php/5809966/mod_resource/content/1/REDES_Aula09.pdf
            // https://paginas.fe.up.pt/~ee06166/documentos/Deteccao_de_erros.pdf
            const ord = polynomial.length

            for(var i=0;i<polynomial.length-1;i++) data+='0'  

            let divPiece : string = data.slice(0,ord);
            for(var i=ord;i<data.length;i++){
                if(divPiece[0]==='1'){
                    divPiece = xor(divPiece,polynomial).slice(1) + data[i]
                }
                else{
                    divPiece = divPiece.slice(1) + data[i]

                }
            }
            trailer = xor(divPiece,polynomial).slice(1)
        break;
        case "Bit de paridade par":
            let sum = 0
            for(const bit of data){
                if(bit==="1") sum+=1
            }
            trailer = (sum%2===0)? "0":"1"
        break;
        }
    dataTrailer = data + trailer

    return trailer;
}

function xor(s1:string,s2:string): string {
    let result: string="";
    // if(s1.length !== s2.length) console.log("s1 e s1 devem ser do msm tamanho");return"";
    for(var i=0; i < s1.length;i++){
        if(s1[i]===s2[i]) result+="0"
        else result+="1" 
    }
    return result
}