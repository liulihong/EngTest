import { levelType, StatusType, PlayType, WaitType } from "./paperStatus";

export const getAnalysis = (type, dataObj) => {
    switch (type) {
        case PlayType.paperTitle:
            {
                if (dataObj.Audio && dataObj.Desc)
                    return { title: dataObj.Desc, audio: dataObj.Audio, staType: StatusType.play, levelType: levelType.paperTitle };
                else return null;
            }
        case PlayType.bigSubTitle:
            {
                if (dataObj.QuesAudio && dataObj.QuesTip)
                    return { title: dataObj.QuesTip, audio: dataObj.QuesAudio, staType: StatusType.play, levelType: levelType.bigSubTitle };
                else return null;
            }
        case PlayType.midSubTitle:
            {
                if (dataObj.TopicAudioPath && dataObj.Desc)
                    return { audio: dataObj.TopicAudioPath, staType: StatusType.play };
                else return null;
            }
        case WaitType.readTime:
            {
                if (dataObj.ReadTime > 0) {
                    return { time: dataObj.ReadTime, staType: StatusType.wait };
                } else return null;
            }
        case PlayType.midSubContent:
            {
                if (dataObj.AudioPath !== null) {
                    return { audio: dataObj.AudioPath, staType: StatusType.play };
                } else return null;
            }
        case PlayType.reporting:
            {
                if (dataObj.ReportingTip && dataObj.ReportingAudio) {
                    return { audio: dataObj.ReportingAudio, tip: dataObj.ReportingTip, staType: StatusType.play };
                } else return null;
            }
        case WaitType.readyTime:
            {
                if (dataObj.ReadyTime > 0) {
                    return { time: dataObj.ReadyTime, staType: StatusType.wait };
                } else return null;
            }
        case PlayType.recordReporting:
            {
                if (dataObj.RecordTip && dataObj.RecordAudio) {
                    return { audio: dataObj.RecordAudio, tip: dataObj.RecordTip, staType: StatusType.play };
                } else return null;
            }
        case PlayType.startReport:
            {
                if (dataObj.isRecord) {
                    return { audio: "common/start.mp3", tip: "开始录音", staType: StatusType.play };
                } else return null;
            }
        case WaitType.answerTime:
            {
                if (dataObj.AnswerTime > 0) {
                    return { time: dataObj.AnswerTime, staType: StatusType.wait };
                } else return null;
            }
        case PlayType.endReport:
            {
                if (dataObj.isRecord) {
                    return { audio: "common/stop.mp3", tip: "停止录音", staType: StatusType.play };
                } else return null;
            }
        case PlayType.endExam:
            {
                return { title:"英语听说考到此结束" ,audio: "common/end.mp3", tip: "结束考试", staType: StatusType.play, levelType: levelType.endPaper  };
            }
        default:
            return;
    }
}