import {
    calculateSessionDurationInSeconds,
} from "@/services/gamesession/sessionUtils";
import { Link } from "react-router-dom";
import { formatDateNL } from "@/services/gamesession/dateUtils";
import { useState, } from "react";
import { Button } from "@/components/ui/button";

interface Exercise {
    startedAt: string;
    endedAt: string;
  }
  
  interface Game {
    name: string;
  }
  
  interface Session {
    id: number;
    patientId: string;
  
    sessionStart: string;
  
    exercises: Exercise[];
  
    game: Game;
  }
  

interface DiagramProps {
    sessions: Session[];
}

export default function Diagram({ sessions }: DiagramProps) {
    const [referenceDate, setReferenceDate] = useState(
        normalizeDate(new Date())
    );

    function normalizeDate(d: string | Date) {
        const date = new Date(d);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function getSessionsFromLastWeek(sessions: Session[]) {
        const sevenDaysBefore = new Date(referenceDate);
        sevenDaysBefore.setDate(referenceDate.getDate() - 6);

        return sessions
            ?.sort((a, b) =>
                new Date(a.sessionStart).getTime() - new Date(b.sessionStart).getTime()
            )
            .filter((s) => {
                const d = normalizeDate(s.sessionStart);
                return d >= sevenDaysBefore && d <= referenceDate;
            });
    }

    function groupByDay(sessions: Session[]) {
        const result: Record<string, Session[]> = {};
        sessions?.forEach((s) => {
            const key = formatDateNL(s.sessionStart);

            if (!result[key]) {
                result[key] = [];
            }

            result[key].push(s);
        });
        return result;
    }

    function getDays() {
        const days: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(referenceDate);
            d.setDate(referenceDate.getDate() - i);
            days.push(formatDateNL(d.toISOString()));
        }
        days.reverse();

        return days;
    }

    function StackedBar({
        blocks,
    }: {
        blocks: {
            height: number;
            color: string;
            id: string;
            patientId: string;
            sessionStart: string;
            game: string;
            duration: number;
            weekIndex: number
        }[];
    }) {
        const [hoverId, setHoverId] = useState<string | null>(null);

        return (
            <div className="flex flex-col justify-end w-10 h-64 bg-gray-100 rounded overflow-hidden"
            >
                {blocks.map((b) => (

                    <Link
                        key={b.id}
                        to={`/session/${b.id}`}
                        state={{ patientId: b.patientId }}
                        className={`block w-full ${b.color} hover:opacity-80 transition border-t-[1px] border-black 
                                        flex items-center justify-center text-white font-bold`}
                        style={{ height: `${b.height}%` }}
                        onMouseEnter={() => setHoverId(b.id)}
                        onMouseLeave={() => setHoverId(null)}
                    >
                        {b.weekIndex}
                        {hoverId === b.id && <SessionInfo session={b} />}
                    </Link>
                ))}
            </div>
        );
    }

    function SessionInfo({ session }: { session: { sessionStart: string; game: string; duration: number } }) {
        return (
            <div className="fixed pointer-events-none z-50 px-2 py-1 text-xs text-black bg-white rounded shadow-lg whitespace-nowrap">
                {"Time: " + new Date(session.sessionStart).getHours() + ":" + (new Date(session.sessionStart).getMinutes() < 10 ? "0" : "") + new Date(session.sessionStart).getMinutes()}
                <br />
                {"Game: " + session.game}
                <br />
                {"Duration: " + Math.floor(session.duration / 60) + " m " + (session.duration % 60 < 10 ? "0" : "") + session.duration % 60 + " s"}
            </div>
        );
    }

    const filtered = getSessionsFromLastWeek(sessions || []);
    const grouped = groupByDay(filtered);

    const days = getDays();

    let globalIndex = 1;

    const totals = days.map((day) => {
        const sessionsToday = grouped[day] || [];
        return sessionsToday.reduce(
            (acc, s) =>
                acc + calculateSessionDurationInSeconds(s.sessionStart, s.exercises || []),
            0
        );
    });

    const maxTotal = Math.max(...totals, 1);
    const maxMinutes = Math.round(maxTotal / 60);

    const ySteps = [1, 0.75, 0.5, 0.25, 0].map((p) =>
        maxMinutes * p
    );

    const barData = days.map((label) => {
        const sessionsToday = grouped[label] || [];

        sessionsToday.sort(
            (a, b) =>
                new Date(a.sessionStart).getTime() -
                new Date(b.sessionStart).getTime()
        );

        const blocks = sessionsToday.map((s) => {
            const sec = calculateSessionDurationInSeconds(s.sessionStart, s.exercises || []);
            const height = (sec / maxTotal) * 100;

            const rand = Math.random();
            const colorRules = [
                { max: 0.33, color: "bg-red-500" },
                { max: 0.66, color: "bg-yellow-400" },
                { max: 1, color: "bg-green-500" },
            ];

            const color = colorRules.find(rule => rand < rule.max)?.color || "";
            if (height > 1) {
                return {
                    height, color, id: s.id, patientId: s.patientId, sessionStart: s.sessionStart, game: s.game.name,
                    duration: calculateSessionDurationInSeconds(
                        s.sessionStart,
                        s.exercises || []
                    ),
                    weekIndex: globalIndex++
                };
            }
        }).filter((block): block is { height: number; color: string; id: any; patientId: any; sessionStart: any; game: any; duration: number; weekIndex: number } => block !== undefined).reverse();

        return { label, blocks };
    });

    function displayWeek(amount: number) {
        const week = new Date(referenceDate);
        week.setDate(referenceDate.getDate() + amount);
        setReferenceDate(week);
    }

    return (
        <div>

            <div className="flex gap-4 mt-4">
                <Button className="bg-[#5e3bee] text-white px-4 py-2 rounded-md hover:bg-[#4c32cb] transition mt-auto self-start md:self-end" onClick={() => displayWeek(-7)}>
                    {"<"}
                </Button>
                <Button className="bg-[#5e3bee] text-white px-4 py-2 rounded-md hover:bg-[#4c32cb] transition mt-auto self-start md:self-end" onClick={() => displayWeek(+7)}>
                    {">"}
                </Button>
                <div className="flex flex-col justify-between h-64 text-sm text-gray-600">
                    {ySteps.map((v, i) => (
                        <span key={i}>{v}m</span>
                    ))}
                </div>

                <div className="flex items-end gap-6">
                    {barData.map((bar, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <StackedBar blocks={bar.blocks} />
                            <span className="mt-2 text-sm">{bar.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
