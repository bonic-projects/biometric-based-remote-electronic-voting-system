import 'dart:async';

import 'package:voter/models/models.dart';
import 'package:voter/services/db_service.dart';
import 'package:stacked/stacked.dart';

import '../../../app/app.locator.dart';
import '../../../app/app.logger.dart';
// import '../../setup_snackbar_ui.dart';

class ControlViewModel extends ReactiveViewModel {
  final log = getLogger('ControlViewModel');

  // final _snackBarService = locator<SnackbarService>();
  // final _navigationService = locator<NavigationService>();
  final _dbService = locator<DbService>();

  DeviceData? get data => _dbService.node;

  bool _isStress = false;
  bool get isStress => _isStress;

  @override
  List<DbService> get reactiveServices => [_dbService];

  double newValue(int value) {
    if (value == 0) return -1;
    return (1 - (((value - 0) * (1 - 0)) / (4095 - 0)) + 0).toDouble().abs();
  }

  List<int> _leds = [0, 0, 0, 0, 0];
  List<int> get leds => _leds;

  void onModelReady() async {
    setBusy(true);
    DeviceLedData? ledData = await _dbService.getLedData();
    if (ledData != null) {
      _leds = <int>[...ledData.leds];
    }
    setBusy(false);
  }

  void ledOnOff(int led) {
    _leds[led] = _leds[led] == 0 ? 1 : 0;
    notifyListeners();
    _dbService.setDeviceData(led: "l${led + 1}", value: _leds[led]);
  }
}
