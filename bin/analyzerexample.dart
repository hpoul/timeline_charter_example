import 'package:timeline_charter/analyzer.dart';
import 'package:timeline_charter/dummyexecutor.dart';
import 'dart:io';
import 'dart:async';

var exampleConfig = [
                     new AnalyzerConfig(
                         sql: null,
                         keys: [''],
                         labels: null,
                         cacheKey: 'example')
                     ];

int main() {
  var dummyExecutor = new DummyExecutor();
  var cacheFuture = SimpleFileCache.createSimpleFileCache(new Directory('example_cache'));
  Future.wait([cacheFuture]).then((valueList) {
    SimpleFileCache cache = valueList[0];
    
    //var cachedExecutor = new CachedQueryExecutor(executor, cache);
    new Analyzer()
      .analyzeConfigs(dummyExecutor, exampleConfig, cache)
      .whenComplete(() {
        dummyExecutor.close();
        Future.wait([cache.close()]);
      });
  });
  return 0;
}
