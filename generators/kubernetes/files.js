/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
    writeFiles
};

function writeFiles() {
    return {
        writeDeployments() {
            for (let i = 0; i < this.appConfigs.length; i++) {
                const appName = this.appConfigs[i].baseName.toLowerCase();
                this.app = this.appConfigs[i];
                this.template('deployment.yml.ejs', `${appName}/${appName}-deployment.yml`);
                this.template('service.yml.ejs', `${appName}/${appName}-service.yml`);
                // If we choose microservice with no DB, it is trying to move _no.yml as prodDatabaseType is getting tagged as 'string' type
                if (this.app.prodDatabaseType !== 'no') {
                    this.template(`db/${this.app.prodDatabaseType}.yml.ejs`, `${appName}/${appName}-${this.app.prodDatabaseType}.yml`);
                }
                if (this.app.searchEngine === 'elasticsearch') {
                    this.template('db/elasticsearch.yml.ejs', `${appName}/${appName}-elasticsearch.yml`);
                }
                if (
                    (this.app.applicationType === 'gateway' || this.app.applicationType === 'monolith') &&
                    this.kubernetesServiceType === 'Ingress'
                ) {
                    this.template('ingress.yml.ejs', `${appName}/${appName}-ingress.yml`);
                }
                if (!this.app.serviceDiscoveryType && this.app.authenticationType === 'jwt') {
                    this.template('secret/jwt-secret.yml.ejs', `${appName}/jwt-secret.yml`);
                }
                if (this.monitoring === 'prometheus') {
                    this.template('monitoring/jhipster-prometheus-sm.yml.ejs', `${appName}/${appName}-prometheus-sm.yml`);
                }
                if (this.istioRoute === true) {
                    this.template('istio/destination-policy.yml.ejs', `${appName}/${appName}-deployment-policy.yml`);
                    this.template('istio/route-rule.yml.ejs', `${appName}/${appName}-route-rule.yml`);
                }
            }
        },

        writeReadme() {
            this.template('README-KUBERNETES.md.ejs', 'README.md');
        },

        writeNamespace() {
            if (this.kubernetesNamespace !== 'default') {
                this.template('namespace.yml.ejs', 'namespace.yml');
            }
        },

        writeMessagingBroker() {
            if (!this.useKafka) return;
            this.template('messagebroker/kafka.yml.ejs', 'messagebroker/kafka.yml');
        },

        writeJhipsterConsole() {
            if (this.monitoring === 'elk') {
                this.template('console/jhipster-elasticsearch.yml.ejs', 'console/jhipster-elasticsearch.yml');
                this.template('console/jhipster-logstash.yml.ejs', 'console/jhipster-logstash.yml');
                this.template('console/jhipster-console.yml.ejs', 'console/jhipster-console.yml');
                this.template('console/jhipster-dashboard-console.yml.ejs', 'console/jhipster-dashboard-console.yml');
                if (this.composeApplicationType === 'microservice') {
                    this.template('console/jhipster-zipkin.yml.ejs', 'console/jhipster-zipkin.yml');
                }
            }
        },

        writePrometheusGrafanaFiles() {
            if (this.monitoring === 'prometheus') {
                this.template('monitoring/jhipster-prometheus-crd.yml.ejs', 'monitoring/jhipster-prometheus-crd.yml');
                this.template('monitoring/jhipster-prometheus-cr.yml.ejs', 'monitoring/jhipster-prometheus-cr.yml');
                this.template('monitoring/jhipster-grafana.yml.ejs', 'monitoring/jhipster-grafana.yml');
                this.template('monitoring/jhipster-grafana-dashboard.yml.ejs', 'monitoring/jhipster-grafana-dashboard.yml');
            }
        },

        writeRegistryFiles() {
            if (this.serviceDiscoveryType === 'eureka') {
                this.template('registry/jhipster-registry.yml.ejs', 'registry/jhipster-registry.yml');
                this.template('registry/application-configmap.yml.ejs', 'registry/application-configmap.yml');
            } else if (this.serviceDiscoveryType === 'consul') {
                this.template('registry/consul.yml.ejs', 'registry/consul.yml');
                this.template('registry/consul-config-loader.yml.ejs', 'registry/consul-config-loader.yml');
                this.template('registry/application-configmap.yml.ejs', 'registry/application-configmap.yml');
            }
        },

        writeConfigRunFile() {
            this.template('kubectl-apply.sh.ejs', 'kubectl-apply.sh');
        }
    };
}
