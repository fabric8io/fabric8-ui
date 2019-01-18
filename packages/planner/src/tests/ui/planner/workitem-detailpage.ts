import * as ui from '../../ui';
import { WorkItemQuickPreview } from './workitem-quickpreview';

export class WorkItemDetailPage extends WorkItemQuickPreview {
  detailPageDiv = new ui.BaseElement(this.$('#wi-detail-form'), 'wi detail page');
}
