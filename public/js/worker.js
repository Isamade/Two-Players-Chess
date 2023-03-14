let possibleMoves;

function returnPossibleMoves() {
    this.postMessage(JSON.stringify(possibleMoves));
}

this.addEventListener('message', function (message) {
    possibleMoves = [];
    message = JSON.parse(message.data);
    const selectedPiece = message.selectedPiece;
    for (let idx = 0; idx < 64; idx++) {
        if (idx === selectedPiece.position) continue;
        const targetSquare = {
            name: message.layout[idx],
            color: Helper.findColor(message.layout[idx]),
            xValue: (idx % 8) + 1,
            yValue: Math.floor(idx/8) + 1,
            position: idx
        }
        const probe = {
            layout: message.layout.slice(),
            canKingCastleLeft: message.canKingCastleLeft,
            canKingCastleRight: message.canKingCastleRight,
            swap: false
        }

        switch (selectedPiece.name) {
            case 'PW':
            case 'PB':
                if (Pawn.move(selectedPiece, targetSquare, probe, null) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            case 'RW':
            case 'RB':
                if (Rook.move(selectedPiece, targetSquare, probe) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            case 'NW':
            case 'NB':
                if (Knight.move(selectedPiece, targetSquare, probe) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            case 'BW':
            case 'BB':
                if (Bishop.move(selectedPiece, targetSquare, probe) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            case 'QW':
            case 'QB':
                if (Queen.move(selectedPiece, targetSquare, probe) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            case 'KW':
            case 'KB':
                if (King.move(selectedPiece, targetSquare, probe) 
                && !(new Checker(selectedPiece.color, probe.layout).wasKingChecked())) {
                    possibleMoves.push(idx);
                };
                break;
            default:
                break;
        }
    }
    returnPossibleMoves.apply(this);
});


class Helper {    
    static findKings (layout) {
        const kingsPositions = {
            white: null,
            black: null
        }
        layout.forEach((value, index) => {
            if (value === 'KW') {
                kingsPositions.white = index;
            }
            if (value === 'KB') {
                kingsPositions.black = index;
            }
        });
        return kingsPositions;
    }
    
    static changeColor(color) {
        return (color === 'white') ? 'black' : 'white';
    }
    
    static findColor(chessPiece) {
        return chessPiece.charAt(1) === 'W' ? 'white' : chessPiece.charAt(1) === 'B' ? 'black' : '';
    }
    
    static updatePosition(probeLayout, currentPosition, targetPosition) {
        const newLayout = probeLayout.slice();
        newLayout[targetPosition] = newLayout[currentPosition];
        newLayout[currentPosition] = '';
        return newLayout;
    }
    
    static diagonalMove(probeLayout, currentSquare, targetSquare) {
        let movePossible = false;
        if (Math.abs(currentSquare.xValue - targetSquare.xValue) === Math.abs(currentSquare.yValue - targetSquare.yValue)) {
            movePossible = true;
            if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 9; pos > targetSquare.position; pos = pos - 9) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false };
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 7; pos > targetSquare.position; pos = pos - 7) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 7; pos < targetSquare.position; pos = pos + 7) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 9; pos < targetSquare.position; pos = pos + 9) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
        }
        return movePossible;
    }
    
    static linearMove(probeLayout, currentSquare, targetSquare) {
        let movePossible = false;
        if (currentSquare.xValue === targetSquare.xValue || currentSquare.yValue === targetSquare.yValue) {
            movePossible = true;
            if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 8; pos > targetSquare.position; pos = pos - 8) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
                for (let pos = currentSquare.position - 1; pos > targetSquare.position; pos = pos - 1) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
                for (let pos = currentSquare.position + 1; pos < targetSquare.position; pos = pos + 1) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 8; pos < targetSquare.position; pos = pos + 8) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
        }
        return movePossible;
    }
}

class Checker {

    constructor(kingColor, layout) {
        this.kingColor = kingColor;
        this.layout = layout;
        this.probe = {
            layout: layout.slice(),
            swap: false,
            canKingCastleLeft: false,
            canKingCastleRight: false
        }
    }

    wasKingChecked() {
        let kingChecked = false;
        let selectedPiece;
        const pos = Helper.findKings(this.probe.layout)[this.kingColor];
        const targetSquare = {
            name: this.probe.layout[pos],
            color: this.kingColor,
            xValue: (pos % 8) + 1,
            yValue: Math.floor(pos/8) + 1,
            position: pos
        };
        const checkProbe = {
            layout: [],
            swap: false,
            canKingCastleLeft: false,
            canKingCastleRight: false
        };
        for (let idx = 0; idx < 64; idx++) {

            if (this.probe.layout[idx] !== '' && this.kingColor !== Helper.findColor(this.probe.layout[idx])) {
                checkProbe.layout = this.probe.layout.slice();
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
}

class Pawn {
    static move(selectedPiece, targetSquare, probe, button) {
        let moved = false;
        if (selectedPiece.color !== targetSquare.color) {

            if (button) {
                probe.layout[selectedPiece.position] = button.classList[0];
                document.querySelector(`.modal-${button.classList[1]}`).classList.remove('show');
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

class Rook {
    static move(selectedPiece, targetSquare, probe){
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

class Knight {
    static move(selectedPiece, targetSquare, probe) {
        let moved = false;
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

class Bishop {
    static move(selectedPiece, targetSquare, probe) {
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

class Queen {
    static move(selectedPiece, targetSquare, probe) {
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

class King {
    static move(selectedPiece, targetSquare, probe) {
        let moved = false;
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
                && Helper.linearMove(probe.layout, selectedPiece, {position: 0, xValue: 1, yValue: 1})
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
                    && Helper.linearMove(probe.layout, selectedPiece, {position: 7, xValue: 8, yValue: 1})
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
                && Helper.linearMove(probe.layout, selectedPiece, {position: 56, xValue: 1, yValue: 8})
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
                    && Helper.linearMove(probe.layout, selectedPiece, {position: 63, xValue: 8, yValue: 8})
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