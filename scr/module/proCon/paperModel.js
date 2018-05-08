import utils from '../utils';

class PaperModel{
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

class bigSubjectModel{
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

class midSubjectModel{
    constructor(model){
        
    }
}