import { z } from "zod";

//export const ECSchema = z.enum(["Bit de paridade par", "CRC"]);

//export type ErrorControlType = z.infer<typeof ECSchema>;


// considerar-se-á os quadros como tendo, no máximo, 7 bits
// headers terão 7 bits
export function addBitCount(data: string): string {
    let dataNaoAlterado : string = data;
    let tamanhoDataEmBits = convertToBin(dataNaoAlterado.length);

    //Instancia variáveis default de quadros
    let quadro1 = convertToBin(64)
    let quadro2 = convertToBin(40)
    let quadro3 = convertToBin(120)
    let quadro4 = convertToBin(80)

    if (data.slice(0,64).length != 64) {
        quadro1 = convertToBin(data.slice(0,64).length)
        quadro2 = "0000000"
        quadro3 = "0000000"
        quadro4 = "0000000"
    } else if (data.slice(64,104).length != 40) {
        quadro2 = convertToBin(data.slice(64,104).length)
        quadro3 = "0000000"
        quadro4 = "0000000"
    } else if (data.slice(104,224).length != 120) {
        quadro3 = convertToBin(data.slice(104,224).length)
        quadro4 = "0000000"
    } else if (data.slice(224,304).length != 80) {
        quadro4 = convertToBin(data.slice(224,304).length)
    } else {
        return "Erro - frase grande demais"
    }
    
    let dataBitContado="";
    dataBitContado = quadro1.concat(data.slice(0,65)).concat(quadro2).concat(data.slice(65,105)).concat(quadro3).concat(data.slice(105,225)).concat(quadro4).concat(data.slice(225,305));
    return dataBitContado;

}

// converte número em string binário de 7 bits
export function convertToBin(n: number){
    let variavelRetorno = (n >>> 0).toString(2);
    while (variavelRetorno.length < 7) {
        variavelRetorno = "0".concat(variavelRetorno)
    }
    return variavelRetorno;
}