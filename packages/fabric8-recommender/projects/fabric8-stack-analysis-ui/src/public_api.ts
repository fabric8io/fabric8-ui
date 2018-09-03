/*
 * Public API Surface of fabric8-stack-analysis-ui
 */
export {StackDetailsModule} from './lib/stack/stack-details/stack-details.module';
export {StackReportInShortModule} from './lib/stack/stack-report-inshort/stack-report-inshort.module';
export {StackAnalysesService} from './lib/stack/stack-analyses.service';
export {getStackReportModel} from './lib/stack/utils/stack-api-utils';
export {AuditInformationModel,
        ComponentInformationModel,
        GithubModel,
        OutlierInformationModel,
        RecommendationsModel,
        ResultInformationModel,
        SentimentModel,
        StackReportModel,
        UserStackInfoModel} from './lib/stack/models/stack-report.model';

