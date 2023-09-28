import {Checker} from "./checker.js";
import Helper from "./helper.js";

interface PieceInterface {
    name: string | null
    color: string | null
    position: number | null
    xValue: number | null
    yValue: number | null
}

interface ProbeInterface {
    checkType: string
    swap: boolean
    canKingCastleLeft: boolean
    canKingCastleRight: boolean
    layout: string[]
}

export class Pawn {
    static move(selectedPiece: PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface, button: Element | null) {
        let moved = false;
        if (selectedPiece.color !== targetSquare.color) {
            if (!selectedPiece.xValue || !targetSquare.xValue || !selectedPiece.yValue || !targetSquare.yValue) {
                return moved
            }

            if (button && selectedPiece.position) {
                probe.layout[selectedPiece.position] = button.classList[0];
                (document.querySelector(`.modal-${button.classList[1]}`) as HTMLDivElement).classList.remove('show');
                probe.swap = false;
                moved = (() => {
                    probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

            else if (selectedPiece.xValue === targetSquare.xValue && targetSquare.color !== Helper.changeColor(selectedPiece.color)) {

                if ((targetSquare.yValue - selectedPiece.yValue) === 1 && selectedPiece.color === 'white') {

                    switch (targetSquare.yValue) {
                        case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                            moved = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        case 8:
                            probe.swap = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        default:
                            break;
                    }

                }

                else if ((targetSquare.yValue - selectedPiece.yValue) === -1 && selectedPiece.color === 'black') {

                    switch (targetSquare.yValue) {
                        case 2: case 3: case 4: case 5: case 6: case 7: case 8:
                            moved = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        case 1:
                            probe.swap = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        default:
                            break;
                    }

                }

                else if ((targetSquare.yValue - selectedPiece.yValue) === 2 && selectedPiece.yValue === 2 && selectedPiece.color === 'white'
                && Helper.linearMove(probe.layout, selectedPiece, targetSquare)) {
                    moved = (() => {
                        probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

                else if ((targetSquare.yValue - selectedPiece.yValue) === -2 && selectedPiece.yValue === 7 && selectedPiece.color === 'black'
                && Helper.linearMove(probe.layout, selectedPiece, targetSquare)) {
                    moved = (() => {
                        probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

            }

            else if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1 && targetSquare.color === Helper.changeColor(selectedPiece.color)) {

                if ((targetSquare.yValue - selectedPiece.yValue) === 1 && selectedPiece.color === 'white') {

                    switch (targetSquare.yValue) {
                        case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                            moved = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        case 8:
                            probe.swap = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                            break;
                        default:
                            break;
                    }

                }

                else if ((targetSquare.yValue - selectedPiece.yValue) === -1 && selectedPiece.color === 'black') {

                    switch (targetSquare.yValue) {
                        case 2: case 3: case 4: case 5: case 6: case 7: case 8:
                            moved = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                        case 1:
                            probe.swap = (() => {
                                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                                return true;
                            })();
                    }

                }
            }

        }
        return (moved || probe.swap)
    }
}

export class Rook {
    static move(selectedPiece: PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface){
        let moved = false;
        if (selectedPiece.color !== targetSquare.color && Helper.linearMove(probe.layout, selectedPiece, targetSquare)) {
            moved = (() => {
                if (selectedPiece.xValue === 1) probe.canKingCastleLeft = false;
                if (selectedPiece.xValue === 8) probe.canKingCastleRight = false;
                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }
        return moved;
    }
}

export class Knight {
    static move(selectedPiece: PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface) {
        let moved = false;
        if (!selectedPiece.xValue || !targetSquare.xValue || !selectedPiece.yValue || !targetSquare.yValue) {
            return moved
        }
        if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 2 && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 1 && selectedPiece.color !== targetSquare.color) {
            moved = (() => {
                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }
    
        else if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1 && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 2 && selectedPiece.color !== targetSquare.color) {
            moved = (() => {
                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }    
        return moved;
    }
}

export class Bishop {
    static move(selectedPiece:PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface) {
        let moved = false;
        if (selectedPiece.color !== targetSquare.color && Helper.diagonalMove(probe.layout, selectedPiece, targetSquare)) {
            moved = (() => {
                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }
        return moved;
    }
}

export class Queen {
    static move(selectedPiece: PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface) {
        let moved = false;
        if (selectedPiece.color !== targetSquare.color && (Helper.diagonalMove(probe.layout, selectedPiece, targetSquare) || Helper.linearMove(probe.layout, selectedPiece, targetSquare))) {
            moved = (() => {
                probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }
        return moved;
    }
}

export class King {
    static move(selectedPiece: PieceInterface, targetSquare: PieceInterface, probe: ProbeInterface) {
        let moved = false;
        if (!selectedPiece.xValue || !targetSquare.xValue || !selectedPiece.yValue || !targetSquare.yValue) {
            return moved
        }
        if (Math.abs(selectedPiece.xValue - targetSquare.xValue) <= 1
            && Math.abs(selectedPiece.yValue - targetSquare.yValue) <= 1
            && ((Math.abs(selectedPiece.xValue - targetSquare.xValue) + Math.abs(selectedPiece.yValue - targetSquare.yValue)) !== 0)
            && selectedPiece.color !== targetSquare.color) {
                moved = (() => {
                    probe.canKingCastleLeft = false;
                    probe.canKingCastleRight = false;
                    probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                    return true;
                })();
        }

        else if (selectedPiece.name === 'KW' && targetSquare.yValue === 1) {
    
            if (probe.canKingCastleLeft && targetSquare.xValue === 2 
                && Helper.linearMove(probe.layout, selectedPiece, {position: 0, xValue: 1, yValue: 1, name:'', color: ''})
                && !(new Checker('white', probe.layout).wasKingChecked())
                && !(new Checker('white', Helper.updatePosition(probe.layout, selectedPiece.position, 2)).wasKingChecked())) {
                moved = (() => {
                    probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                    probe.layout = Helper.updatePosition(probe.layout, 0, 2);
                    probe.canKingCastleLeft = false;
                    probe.canKingCastleRight = false;
                    return true;
                })();
            }

            else if (probe.canKingCastleRight && targetSquare.xValue === 6 
                    && Helper.linearMove(probe.layout, selectedPiece, {position: 7, xValue: 8, yValue: 1, name: '', color: ''})
                    && !(new Checker('white', probe.layout).wasKingChecked())
                    && !(new Checker('white', Helper.updatePosition(probe.layout, selectedPiece.position, 4)).wasKingChecked())) {
                    moved = (() => {
                        probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                        probe.layout = Helper.updatePosition(probe.layout, 7, 4);
                        probe.canKingCastleLeft = false;
                        probe.canKingCastleRight = false;
                        return true;
                    })();
            }

        }

        else if (selectedPiece.name === 'KB' && targetSquare.yValue === 8) {
    
            if (probe.canKingCastleLeft && targetSquare.xValue === 2 
                && Helper.linearMove(probe.layout, selectedPiece, {position: 56, xValue: 1, yValue: 8, name: '', color: ''})
                && !(new Checker('black', probe.layout).wasKingChecked())
                && !(new Checker('black', Helper.updatePosition(probe.layout, selectedPiece.position, 58)).wasKingChecked())) {
                moved = (() => {
                    probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                    probe.layout = Helper.updatePosition(probe.layout, 56, 58);
                    probe.canKingCastleLeft = false;
                    probe.canKingCastleRight = false;
                    return true;
                })();
            }

            else if (probe.canKingCastleRight && targetSquare.xValue === 6 
                    && Helper.linearMove(probe.layout, selectedPiece, {position: 63, xValue: 8, yValue: 8, name: '', color: ''})
                    && !(new Checker('black', probe.layout).wasKingChecked())
                    && !(new Checker('black', Helper.updatePosition(probe.layout, selectedPiece.position, 60)).wasKingChecked())) {
                    moved = (() => {
                        probe.layout = Helper.updatePosition(probe.layout, selectedPiece.position, targetSquare.position);
                        probe.layout = Helper.updatePosition(probe.layout, 63, 60);
                        probe.canKingCastleLeft = false;
                        probe.canKingCastleRight = false;
                        return true;
                })();
            }

        }
        return moved;
    }
}