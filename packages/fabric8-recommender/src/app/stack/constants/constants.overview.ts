/**
 * Constants for the OverviewComponent
 * The key for this mapping in constants-mapper.ts is 'overview'
 */
export const OVERVIEW_CONSTANT: any = {
    'title': 'Stack Overview',
    'cve_title': 'CVEs',
    'summary': 'Summary',
    'licenseInformation': 'License Information',
    'issueMetrics': 'Issue Metrics',
    'activity': 'Activity',
    'codeMetrics': 'Code Metrics',
    'dependencies': 'Dependencies',
    'security': 'Security',
    'license': 'Total Licenses Used',
    'noDependencies': {
        'message': 'Could not build stack overview.',
        'submessage': 'There was a problem and we couldn\'t build a full stack overview analysis.'
    },
    'cvss': 'cvss',
    'score': 'score',
    'totalCvss': 'of 10',
    'total': 'Total',
    'noCve' : {
        'message': 'No security alerts',
        'subMessage': 'No known CVE data found for the dependencies.'
    },
    'noLicense': 'No License data available',
    'cvssScoreTooltip': 'CVSS: Score to measure the impact of security vulnerability. In a scale from 0.0-10.0, vulnerabilities less than 7.0 are considered medium impact and more than or equal to 7.0 are considered high impact ones.',
    'othersLegend': 'Others'
};
