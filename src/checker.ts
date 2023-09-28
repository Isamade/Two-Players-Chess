import {Pawn, Rook, Knight, Bishop, Queen, King} from "./chessPieces.js";
import Helper from "./helper.js";

interface ProbeInterface {
    checkType: string
    swap: boolean
    canKingCastleLeft: boolean
    canKingCastleRight: boolean
    layout: string[]
}

export class Checker {
    kingColor: string
    layout: string[]
    probe: ProbeInterface
    constructor(kingColor: string, layout: string[]) {
        this.kingColor = kingColor;
        this.layout = layout;
        this.probe = {
            checkType: '',
            layout: layout.slice(),
            swap: false,
            canKingCastleLeft: false,
            canKingCastleRight: false
        }
    }

    wasKingChecked() {
        let kingChecked = false;
        let selectedPiece;
        const pos = Helper.findKings(this.probe.layout)[this.kingColor as keyof {white: number, black: number}];
        //const pos = (0).toString();
        if (pos === null) {
            return
        }
        const targetSquare = {
            name: this.probe.layout[pos],
            color: this.kingColor,
            xValue: ((pos % 8) + 1),
            yValue: (Math.floor(pos/8) + 1),
            position: pos
        };
        const checkProbe = {
            checkType: '',
            layout: [],
            swap: false,
            canKingCastleLeft: false,
            canKingCastleRight: false
        };
        for (let idx = 0; idx < 64; idx++) {

            if (this.probe.layout[idx] !== '' && this.kingColor !== Helper.findColor(this.probe.layout[idx])) {
                (checkProbe.layout as string[]) = this.probe.layout.slice();
                selectedPiece = {
                    name: this.probe.layout[idx],
                    color: Helper.findColor(this.probe.layout[idx]),
                    xValue: (idx % 8) + 1,
                    yValue: Math.floor(idx/8) + 1,
                    position: idx
                };

                switch (this.probe.layout[idx]) {
                    case 'PW':
                    case 'PB':
                        kingChecked = Pawn.move(selectedPiece, targetSquare, checkProbe, null);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'RW':
                    case 'RB':
                        kingChecked = Rook.move(selectedPiece, targetSquare, checkProbe);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'NW':
                    case 'NB':
                        kingChecked = Knight.move(selectedPiece, targetSquare, checkProbe);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'BW':
                    case 'BB':
                        kingChecked = Bishop.move(selectedPiece, targetSquare, checkProbe);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'QW':
                    case 'QB':
                        kingChecked = Queen.move(selectedPiece, targetSquare, checkProbe);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'KW':
                    case 'KB':
                        kingChecked = King.move(selectedPiece, targetSquare, checkProbe);
                        if (kingChecked) { return kingChecked };
                        break;
                    default:
                        break;
                }
            }
        }
        return kingChecked;
    }

    cantMove() {
        let selectedPiece, targetSquare, moved;

        for (let idx = 0; idx < 64; idx++) {

            if (this.layout[idx] !== '' && this.kingColor === Helper.findColor(this.layout[idx])) {
                selectedPiece = {
                    name: this.layout[idx],
                    color: Helper.findColor(this.layout[idx]),
                    xValue: (idx % 8) + 1,
                    yValue: Math.floor(idx/8) + 1,
                    position: idx
                };

                for (let idx = 0; idx < 64; idx++) {
                    targetSquare = {
                        name: this.layout[idx],
                        color: Helper.findColor(this.layout[idx]),
                        xValue: (idx % 8) + 1,
                        yValue: Math.floor(idx/8) + 1,
                        position: idx
                    }

                    switch (selectedPiece.name) {
                        case 'PW':
                        case 'PB':
                            moved = Pawn.move(selectedPiece, targetSquare, this.probe, null);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        case 'RW':
                        case 'RB':
                            moved = Rook.move(selectedPiece, targetSquare, this.probe);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        case 'NW':
                        case 'NB':
                            moved = Knight.move(selectedPiece, targetSquare, this.probe);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        case 'BW':
                        case 'BB':
                            moved = Bishop.move(selectedPiece, targetSquare, this.probe);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        case 'QW':
                        case 'QB':
                            moved = Queen.move(selectedPiece, targetSquare, this.probe);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        case 'KW':
                        case 'KB':
                            moved = King.move(selectedPiece, targetSquare, this.probe);
                            if (moved && !this.wasKingChecked()) { return false };
                            break;
                        default:
                            break;
                    }

                    this.probe.layout = this.layout.slice();

                }
            }
        }

        return true;
    }

    findCheckType() {
        switch (this.wasKingChecked()) {
            case false:
                return ((this.cantMove() && 'Stalemate') || '');
            case true:
                return ((this.cantMove() && 'Checkmate') || 'Check');
        }
    }
}