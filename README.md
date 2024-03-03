# How ther rolling update works in K8S

During a rolling update, Kubernetes updates pods with a new version in a controlled way, terminating old pods and starting new ones. The key to a smooth update is ensuring that the old pods don't get terminated before they've finished handling their current connections. Kubernetes sends a `SIGTERM` signal to the containers in the pod to initiate a graceful shutdown, followed by a `SIGKILL` signal after a `grace period`.
But when the `SIGTERM` signal sent in parallel there could be ongoing request that will hit container which already shutdown. This is open issue in k8s right now.

## Why connctions can be broken during update
1. You have 1 replica which makes impossible of rolling update
2. Your server not shutdown gracefully broken some connections
3. `Grace period` time between `SIGTERM` and `SIGKILL` is too small and not enough server to close all connections gracefully, so some of them could be broken
4. Updating routing can take some time, so when `SIGTERM` sent in parallel there could be also some amount of requests, that will be lost.
This is an open issue in k8s hope it will be fixed soon. You can read about it here: https://engineering.rakuten.today/post/graceful-k8s-delpoyments/

## How to fix
1. Always run deployments with replica > 1
2. Use gracefull shutdown in your application
3. Increase `terminationGracePeriodSeconds` for you deployment based on monitoring and you knowledge of how long typically take to handle request
4. Use preStop Hook to block new incomming requests on k8s level 
