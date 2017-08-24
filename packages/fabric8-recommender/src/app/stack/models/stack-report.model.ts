export class StackReportModel {
    finished_at: string;
    request_id: string;
    result: Array<ResultInformationModel>;
    started_at: string;
}

export class ResultInformationModel {
    audit: AuditInformationModel;
    release: string;
    manifest_name: string;
    manifest_file_path: string;
    recommendation: RecommendationsModel;
    user_stack_info: UserStackInfoModel;
}

export class AuditInformationModel {
    ended_at: string;
    started_at: string;
    version: string;
}

export class RecommendationsModel {
    alternate: Array<ComponentInformationModel>;
    companion: Array<ComponentInformationModel>;
    usage_outliers: Array<OutlierInformationModel>;
}

export class ComponentInformationModel {
    code_metrics: any; // Ignored from strict typing as this is of least importance
    ecosystem: string;
    github: GithubModel;
    latest_version: string;
    licenses: Array<string>;
    license_analysis: LicenseAnalysisModel;
    name: string;
    osio_user_count: number;
    replaces: any;
    security: Array<any>;
    sentiment: SentimentModel;
    version: string;
}

export class LicenseAnalysisModel {
    conflict_licenses: Array<any>;
    status: string;
    unknown_licenses: Array<any>;
    _message: string;
    _representative_licenses: any;
}

export class GithubModel {
    contributors: number;
    dependent_projects: number;
    dependent_repos: number;
    first_release_date: string;
    forks_count: number;
    issues: {
        month: {
            closed: number;
            opened: number;
        };
        year: {
            closed: number;
            opened: number;
        }
    };
    latest_release_duration: string;
    pull_requests: {
        month: {
            closed: number;
            opened: number;
        };
        year: {
            closed: number;
            opened: number;
        }
    };
    size: string;
    stargazers_count: number;
    total_releases: number;
    used_by: Array<any>;
    watchers: number;
}

export class SentimentModel {
    latest_comment: string;
    overall_score: number;
}

export class OutlierInformationModel {
    outlier_probabilty: number;
    package_name: string;
}

export class UserStackInfoModel {
    analyzed_dependencies: Array<any>;
    analyzed_dependencies_count: number;
    dependencies: Array<ComponentInformationModel>;
    distinct_licenses: Array<string>;
    ecosystem: string;
    recommendation_ready: boolean;
    recommended_stack_licenses: Array<string>;
    stack_license_conflict: boolean;
    total_licenses: number;
    unknown_dependencies: Array<any>;
    unknown_dependencies_count: number;
}
