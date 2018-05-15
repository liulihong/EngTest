import utils from '../../utils';

//试卷模型
export class PaperModel{
    constructor(model){
        this.PriTitle=model.PriTitle;
        this.SecTitle=model.SecTitle;
        this.Title=model.Title;
        this.Summary=model.Summary;
        this.Audio=model.Audio;
        this.Desc=model.Desc;
        this.Groups=model.Groups;
    }
}
// PaperModel.Groups[n] ---> BigSubjectModel
//大题模型
export class BigSubjectModel{
    constructor(model){
       this.Type=model.Type;
       this.QuesTip=model.QuesTip;
       this.QuesAudio=model.QuesAudio;
       this.QuesDesc=model.QuesDesc;
       this.ExamTopics=model.ExamTopics;
       this.TotalScore=model.TotalScore;
       this.ImgList=model.ImgList;
    }
}

// BigSubjectModel.ExamTopics[n] ---> MidSubjectModel
//一段音频内容对应的 多个小题 （中型模型）
export class MidSubjectModel{
    constructor(model){
        this.ID=model.ID;
        this.Title=model.Title;
        this.TopicAudioPath=model.TopicAudioPath;
        this.Desc=model.Desc;
        this.ReadTime=model.ReadTime;
        this.AnswerTime=model.AnswerTime;
        this.AudioText=model.AudioText;
        this.IsHideAudioPath=model.IsHideAudioPath;
        this.AudioPath=model.AudioPath;
        this.TopicInfoList=model.TopicInfoList;
        this.ReportingTip=model.ReportingTip;
        this.ReportingAudio=model.ReportingAudio;
        this.RecordTip=model.RecordTip;
        this.RecordAudio=model.RecordAudio;
        this.ReadyTime=model.ReadyTime;
    }
}
// MidSubjectModel.TopicInfoList[n] ---> MinSubjectModel
//小题模型
export class MinSubjectModel{
    constructor(model){
        this.ID=model.ID;
        this.UniqueID=model.UniqueID;
        this.Title=model.Title;
        this.Img=model.Img;
        this.Score=model.Score;
        this.Correct=model.Correct;
        this.ExampleAnswer=model.ExampleAnswer;
        this.ExampleAnswerKey=model.ExampleAnswerKey;
        this.ExampleContent=model.ExampleContent;
        this.Answers=model.Answers;
    }
}