import { diagonalMove, linearMove, updatePosition } from "./utility.js";

export const pawn = (selectedPiece, targetSquare, pieceDataStore, button) => {
    let moved = false;

    if (selectedPiece.color === 'white' && targetSquare.color !== 'white') {

        if (button && button.classList[1] === 'white') {
            pieceDataStore.probeBoard[selectedPiece.position] = button.classList[0];
            document.querySelector('.modal-white').classList.remove('show');
            pieceDataStore.swap = false;
            moved = (() => {
                updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }

        else if (selectedPiece.xValue === targetSquare.xValue && targetSquare.color !== 'black') {

            if ((targetSquare.yValue - selectedPiece.yValue) === 1) {

                if (targetSquare.yValue !== 8) {
                    moved = (() => {
                        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

                else if (targetSquare.yValue === 8) {
                    pieceDataStore.swap = (() => {
                        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

            }

            else if ((targetSquare.yValue - selectedPiece.yValue) === 2 && selectedPiece.yValue === 2) {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

        }

        else if ((targetSquare.yValue - selectedPiece.yValue) === 1 && Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1) {

            if (targetSquare.yValue !== 8 && targetSquare.color === 'black') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

            else if (targetSquare.yValue === 8 && targetSquare.color === 'black') {
                pieceDataStore.swap = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

        }

    }

    else if (selectedPiece.color === 'black' && targetSquare.color !== 'black') {

        if (button && button.classList[1] === 'black') {
            pieceDataStore.probeBoard[selectedPiece.position] = button.classList[0];
            document.querySelector('.modal-black').classList.remove('show');
            pieceDataStore.swap = false;
            moved = (() => {
                updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                return true;
            })();
        }

        else if (selectedPiece.xValue === targetSquare.xValue && targetSquare.color !== 'white') {

            if ((targetSquare.yValue - selectedPiece.yValue) === -1) {

                if (targetSquare.yValue !== 1) {
                    moved = (() => {
                        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

                else if (targetSquare.yValue === 1) {
                    pieceDataStore.swap = (() => {
                        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                        return true;
                    })();
                }

            }

            else if ((targetSquare.yValue - selectedPiece.yValue) === -2 && selectedPiece.yValue === 7) {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }
        }

        else if ((targetSquare.yValue - selectedPiece.yValue) === -1 && Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1) {

            if (targetSquare.yValue !== 1 && targetSquare.color === 'white') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

            else if (targetSquare.yValue === 1 && targetSquare.color === 'white') {
                pieceDataStore.swap = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    return true;
                })();
            }

        }

    }

    return (moved || pieceDataStore.swap)
}

export const rook = (selectedPiece, targetSquare, pieceDataStore) => {
    let moved = linearMove(pieceDataStore.probeBoard, selectedPiece, targetSquare);
    if (moved === true && selectedPiece.color !== targetSquare.color) {
        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
    }
    return moved;
}

export const knight = (selectedPiece, targetSquare, pieceDataStore) => {
    let moved = false;
    if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 2 && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 1 && selectedPiece.color !== targetSquare.color) {
        moved = (() => {
            updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
            return true;
        })();
    }
    else if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1 && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 2 && selectedPiece.color !== targetSquare.color) {
        moved = (() => {
            updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
            return true;
        })();
    }
    return moved;
}

export const bishop = (selectedPiece, targetSquare, pieceDataStore) => {
    let moved = diagonalMove(pieceDataStore.probeBoard, selectedPiece, targetSquare);
    if (moved === true && selectedPiece.color !== targetSquare.color) {
        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
    }
    return moved;
}

export const queen = (selectedPiece, targetSquare, pieceDataStore) => {
    let moved =  diagonalMove(pieceDataStore.probeBoard, selectedPiece, targetSquare) || linearMove(pieceDataStore.probeBoard, selectedPiece, targetSquare);
    if (moved === true && selectedPiece.color !== targetSquare.color) {
        updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
    }
    return moved;
}

export const king = (selectedPiece, targetSquare, pieceDataStore) => {
    let moved = false;
    if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1 && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 1 && selectedPiece.color !== targetSquare.color) {
        moved = (() => {
            updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
            return true;
        })();
    }
    else if (Math.abs(selectedPiece.xValue - targetSquare.xValue) === 1  && selectedPiece.yValue === targetSquare.yValue && selectedPiece.color !== targetSquare.color) {
        moved = (() => {
            updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
            return true;
        })();
    }
    else if (selectedPiece.xValue === targetSquare.xValue && Math.abs(selectedPiece.yValue - targetSquare.yValue) === 1 && selectedPiece.color !== targetSquare.color) {
        moved = (() => {
            updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
            return true;
        })();
    }
    else if (!pieceDataStore.hasKingCastled && linearMove(pieceDataStore.probeBoard, selectedPiece, targetSquare)  && targetSquare.name === '') {

        if (selectedPiece.name === 'KW' && selectedPiece.yValue === 1 && targetSquare.yValue === 1 && selectedPiece.xValue === 4) {
            if (targetSquare.xValue === 2 && pieceDataStore.probeBoard[0] === 'RW') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    updatePosition(pieceDataStore.probeBoard, 0, 2);
                    pieceDataStore.hasKingCastled = true;
                    return true;
                })();
            }

            else if (targetSquare.xValue === 6 && pieceDataStore.probeBoard[7] === 'RW') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    updatePosition(pieceDataStore.probeBoard, 7, 4);
                    pieceDataStore.hasKingCastled = true;
                    return true;
                })();
            }

        }

        else if (selectedPiece.name === 'KB' && selectedPiece.yValue === 8 && targetSquare.yValue === 8 && selectedPiece.xValue === 4) {
            if (targetSquare.xValue === 2 && pieceDataStore.probeBoard[56] === 'RB') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    updatePosition(pieceDataStore.probeBoard, 56, 58);
                    pieceDataStore.hasKingCastled = true;
                    return true;
                })();
            }

            else if (targetSquare.xValue === 6 && pieceDataStore.probeBoard[63] === 'RB') {
                moved = (() => {
                    updatePosition(pieceDataStore.probeBoard, selectedPiece.position, targetSquare.position);
                    updatePosition(pieceDataStore.probeBoard, 63, 60);
                    pieceDataStore.hasKingCastled = true;
                    return true;
                })();
            }
            
        }
    }
    return moved;
}