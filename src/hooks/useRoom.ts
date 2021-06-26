import {useEffect, useState} from "react";
import {database} from "../services/firebase";
import {useAuth} from "./useAuth";
import {QuestionType} from "../types/QuestionType";
import {FiresabeQuestions} from "../types/FirebaseQuestions";


export function useRoom(roomId: string) {
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState("");
    const {user} = useAuth();

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`);

        roomRef.on("value", (room) => {
            const databaseRoom = room.val();
            const firebaseQuestions: FiresabeQuestions = databaseRoom.questions ?? {};
            const parsedQuestions = Object.entries(firebaseQuestions).map(
                ([key, value]) => {
                    return {
                        id: key,
                        content: value.content,
                        author: value.author,
                        isHighlighted: value.isHighlighted,
                        isAnswered: value.isAnswered,
                        likeCount: Object.values(value.likes ?? {}).length,
                        likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                    };
                }
            );
            setQuestions(parsedQuestions);
            setTitle(databaseRoom.title);
        });
        return () => {
            roomRef.off("value");
        }
    }, [roomId, user?.id]);

    return {questions, title}
}