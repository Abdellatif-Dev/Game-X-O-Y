import { useMemo, useState } from "react";

export default function TicTacToe() {
  const [size, setSize] = useState(6);
  const [winLength, setWinLength] = useState(4);
  const [squares, setSquares] = useState(Array(36).fill(null));
  const [scores, setScores] = useState({ X: 0, O: 0, Y: 0 });
  const [Next, setXIsNext] = useState("X");
  const [round, setRound] = useState(1);
  const [Mode, setMode] = useState(false);
  const [Players, setPlayers] = useState(3);
  const [style, setStyle] = useState("grid gap-3 grid-cols-6");
  const [moves, setMoves] = useState({ X: [], O: [], Y: [] });

  const { winner, line } = useMemo(() => {
    const lines = [];

    const range = (start, step) => [...Array(winLength).keys()].map(i => start + i * step);

    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        lines.push(range(row * size + col, 1));
      }
    }

    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLength; row++) {
        lines.push(range(row * size + col, size));
      }
    }

    for (let row = 0; row <= size - winLength; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        lines.push(range(row * size + col, size + 1));
      }
    }

    for (let row = 0; row <= size - winLength; row++) {
      for (let col = winLength - 1; col < size; col++) {
        lines.push(range(row * size + col, size - 1));
      }
    }

    for (const l of lines) {
      const first = squares[l[0]];
      if (first && l.every(i => squares[i] === first)) {
        return { winner: first, line: l };
      }
    }

    return { winner: null, line: [] };
  }, [squares, size, winLength]);
  function handleClick(i) {
    if (squares[i] || winner) return;
    const current = Next;
    let next;
    if (Players === 3) {
      next = current === "X" ? "O" : current === "O" ? "Y" : "X";
    } else {
      next = current === "X" ? "O" : "X";
    }
    const nextSquares = squares.slice();
    let nextMoves = { ...moves };

    if (nextMoves[current].length === winLength) {
      const oldestIndex = nextMoves[current][0];
      nextSquares[oldestIndex] = null;
      nextMoves[current] = nextMoves[current].slice(1);
    }

    nextSquares[i] = current;
    nextMoves[current] = [...nextMoves[current], i];

    setSquares(nextSquares);
    setMoves(nextMoves);
    setXIsNext(next);
  }

  function nextRound() {
    if (winner) {
      if (Players === 3) {
        setScores((s) => ({
          X: s.X + (winner === "X" ? 1 : 0),
          O: s.O + (winner === "O" ? 1 : 0),
          Y: s.Y + (winner === "Y" ? 1 : 0),
        }));
        setRound((r) => r + 1);

      } else {
        setScores((s) => ({
          X: s.X + (winner === "X" ? 1 : 0),
          O: s.O + (winner === "O" ? 1 : 0)
        }));
        setRound((r) => r + 1);
      }
    }
    setSquares(Array(size * size).fill(null));
    if (Players === 3) {
      const starters = ["X", "O", "Y"];
      setXIsNext(starters[round % 3]);
      setMoves({ X: [], O: [], Y: [] });
    } else {
      const starters = ["X", "O"];
      setXIsNext(starters[round % 2]);
      setMoves({ X: [], O: [] });
    }
  }

  function resetScores() {
    if (Players === 3) {
      setScores({ X: 0, O: 0, Y: 0 });
      setMoves({ X: [], O: [], Y: [] });
    } else {
      setScores({ X: 0, O: 0 });
      setMoves({ X: [], O: [] });
    }
    setRound(1);
    setSquares(Array(size * size).fill(null));

  }

  function changeMode() {
    setMode(!Mode);
  }

  const status = winner ? `الفائز: ${winner}` : "";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {Mode && (
        <div className="z-20 absolute flex justify-center items-center bg-black/45 w-full h-svh">
          <div className="relative w-2/5 h-2/5 flex justify-center items-center  bg-slate-800 rounded-2xl">
            <button onClick={() => setMode(false)} className=" absolute top-2 right-4 text-3xl z-10  text-red-500">X</button>
            <div>
              <div className="flex items-center space-x-8">
                <h1 className="text-2xl text-gray-300">Mode:</h1>
                {[3, 4, 5, 6, 7].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setSize(n);
                      setSquares(Array(n * n).fill(null));
                      setStyle(`grid gap-3 grid-cols-${n}`);
                    }}
                    disabled={winLength > n || Players === n}
                    className={
                      "px-4 py-2 h-12 rounded-lg " + (size === n ? "bg-sky-700" : "bg-slate-700 hover:bg-slate-900")
                      + ((winLength > n || Players === n) ? " opacity-40 cursor-not-allowed  ":"")
                    } >
                    {n}x{n}
                  </button>
                ))}
              </div>
              <div className="flex justify-start items-center space-x-8 mt-6">
                <h1 className="text-2xl text-gray-300">عدد خنات الفوز:</h1>
                {[3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setWinLength(n);
                      nextRound()
                    }}
                    disabled={n > size} 
                    className={
                      "px-4 py-2 h-12 rounded-lg " + (winLength === n ? "bg-sky-700" : "bg-slate-700 hover:bg-slate-900") 
                      + (n > size ? " opacity-40 cursor-not-allowed  ":"")
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-start items-center space-x-8 mt-6">
                <h1 className="text-2xl text-gray-300">عدد الاعبين:</h1>
                <button
                  onClick={() => {
                    setScores({ X: 0, O: 0 });
                    setMoves({ X: [], O: [] });
                    setPlayers(2);
                    nextRound()
                  }}
                  className={
                    "px-4 py-2 h-12 rounded-lg " + (Players === 2 ? "bg-sky-700" : "bg-slate-700 hover:bg-slate-900")
                  }
                >
                  2
                </button>
                <button
                  onClick={() => {
                    setScores({ X: 0, O: 0, Y: 0 });
                    setMoves({ X: [], O: [], Y: [] });
                    setPlayers(3);
                    nextRound()
                  }}
                  disabled={size === 3} 
                  className={
                    "px-4 py-2 h-12 rounded-lg " + (Players === 3 ? "bg-sky-700" : "bg-slate-700 hover:bg-slate-900")
                    + (3 === size ? " opacity-40 cursor-not-allowed  ":"")
                  }
                >
                  3
                </button>

              </div>
              <div className="flex justify-center items-center  mt-6">
                <button
                onClick={() => {
                    setMode(false); 
                  }}
                  className="px-4 py-2 h-12 rounded-lg  bg-slate-700 hover:bg-slate-900 text-2xl text-gray-200"
                  
                >
                  choiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="mb-4 text-center">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            X-O-Y
          </h1>
          <div className="flex">
            <button
              onClick={changeMode}
              className="bg-slate-600 hover:bg-slate-800 text-gray-200 px-3 py-1 rounded-md z-10 absolute"
            >
              اختيار
            </button>
            <div className="flex justify-center w-full">
              <p className="text-slate-300 mt-1">جولة رقم {round}</p>
            </div>
          </div>
        </div>

        {
          Players === 3 ? (
            <div className="grid grid-cols-3 gap-2 mb-4">
              <ScoreCard label="X" value={scores.X} accent="from-yellow-400 to-yellow-500" />
              <ScoreCard label="Y" value={scores.Y} accent="from-slate-300 to-slate-400" />
              <ScoreCard label="O" value={scores.O} accent="from-cyan-400 to-cyan-500" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <ScoreCard label="X" value={scores.X} accent="from-yellow-400 to-yellow-500" />
              <ScoreCard label="O" value={scores.O} accent="from-cyan-400 to-cyan-500" />
            </div>
          )
        }

        <div className="bg-slate-900/60 backdrop-blur rounded-2xl p-4 shadow-xl ring-1 ring-white/10">
          <div className={style}>
            {squares.map((val, i) => {
              const isWinning = line.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  className={
                    "aspect-square rounded-2xl text-4xl font-extrabold flex items-center justify-center select-none " +
                    "shadow-md ring-1 ring-white/10 transition-transform active:scale-95 " +
                    (val
                      ? "bg-slate-800 text-white"
                      : "bg-slate-800/60 text-slate-300 hover:bg-slate-800") +
                    (isWinning ? " outline outline-4 outline-emerald-400/70" : "")
                  }
                  disabled={Boolean(val) || Boolean(winner)}
                >
                  <span
                    className={
                      val === "X"
                        ? "text-yellow-400"
                        : val === "O"
                          ? "text-cyan-400"
                          : "text-orange-600"
                    }
                  >
                    {val}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-slate-200 font-semibold text-lg">{status}</div>
            <div className="flex gap-2">
              <button
                onClick={nextRound}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold ring-1 ring-white/10 shadow"
              >
                جولة جديدة
              </button>
              <button
                onClick={resetScores}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold shadow"
              >
                تصفير النقاط
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 mt-3 text-sm">
          يبدأ X أولاً في الجولة 1. يتناوب من يبدأ كل جولة للعدل. <br />
          الاعبين {Players} , عدد خانات الفوز {winLength}
        </p>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl p-3 bg-slate-900/60 ring-1 ring-white/10 shadow flex items-center justify-between">
      <div>
        <div className="text-slate-300 text-xs">{label}</div>
        <div
          className={`text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br ${accent}`}
        >
          {value}
        </div>
      </div>
      <div className="text-slate-500 text-xs">نقاط</div>
    </div>
  );
}