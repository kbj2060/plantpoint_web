import gql from 'graphql-tag';

const SWITCH_FEED = gql`
  query switchFeedQuery($filter: String, $skip:Int, $first:Int, $orderBy: SwitchOrderByInput, $last: Int){
    switchFeed(filter: $filter, skip: $skip, first: $first, orderBy : $orderBy, last: $last){
        switches{
          status
          updatedAt
        }
        count
    }
}`;

const FIGURE_FEED = gql`
  query figureFeedQuery($filter: String, $skip:Int, $first:Int, $orderBy: SwitchOrderByInput, $last: Int){
    figureFeed(filter: $filter, skip: $skip, first: $first, orderBy : $orderBy, last: $last){
        figures{
          value
          updatedAt
        }
    }
}`;

const GET_CURRENT_USER = gql`
  query getCurrentUserQuery {
    getCurrentUser{
      name
    }
  }`;

const GET_SETTING = gql`
  query getSettingQuery( $last: Int){
    getSetting(last: $last){
      subjects{
        measurement
        start
        end
      }
      appliedBy{
        name
      }
    }
  }
`;

const SWITCH_CONTROL = gql`
  mutation switchControlMutation( $machine: SwitchFormat!, $status:Boolean! ){
    switchControl(machine: $machine, status: $status){
      updatedAt
      machine
      status
      controledBy {
        name
      }
    }
}`;


const SETTING = gql`
  mutation settingMutation ($measurement: [SettingFormat!]!, $start:[Float!]!, $end:[Float!]!) {
      setting(measurement: $measurement, start: $start, end: $end){
        id
        subjects{
          start
          end
          measurement
        }
        appliedBy{
          name
        }
      }
  }
`;

const NEW_SWITCH = gql`
  subscription newSwitchSubscription ($machine: SwitchFormat!) {
      newSwitch(machine: $machine){
        machine
        status
        updatedAt
        controledBy{
          name
        }
      }
  }
`;

const NEW_FIGURE = gql`
  subscription newFigureSubscription ($measurement: MeasurementFormat) {
      newFigure(measurement: $measurement){
          value
          measurement
          updatedAt
      }
  }
`;




export{
    NEW_FIGURE,
    NEW_SWITCH,
    SWITCH_CONTROL,
    SETTING,
    SWITCH_FEED,
    FIGURE_FEED,
    GET_CURRENT_USER,
    GET_SETTING
}
