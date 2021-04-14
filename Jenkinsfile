@NonCPS

def repositoryName  = 'united-water_api'
def jenkinsURL      = 'https://jenkins.citronium.com/view/Base/job/united-water_api/'
def chatId          = ''
def token           = ''

def branch        = env.BRANCH_NAME
def dockerRegistry  = "registry.citronium.com/${repositoryName}"
def imageTag

node {
    try {
      stage("Checkout") {
         git branch: "${branch}",
          url: 'git@github.com:Citronium/united-water_api.git'

        def commit_hash = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
        def now = new Date()
        imageTag = "${now.format('yyMMdd', TimeZone.getTimeZone('UTC'))}_${branch}_${BUILD_NUMBER}_${commit_hash}"
        imageTag = imageTag.toLowerCase()
        imageTag = imageTag.replaceAll('/', '_')
      }

      stage("Start") {
        sendMessage("☑ Build №${env.BUILD_NUMBER}: Start ${imageTag} ${env.JOB_URL} ${sendChangeLogs()}")
      }

      stage("Build") {
        sh "docker build -t ${dockerRegistry}:${imageTag} ."
      }

      stage("Push") {
        sh "docker push ${dockerRegistry}:${imageTag}"
      }

      stage("Docker start at psrv5") {
        sh "APP_VERSION=${imageTag} docker-compose -p united-water up -d"
      }

      stage("Finish") {
        sendMessage("🛠✅ Build ${repositoryName} №${env.BUILD_NUMBER}: ${imageTag}. Finish. Deploy: https://${jenkinsURL}/job/api_deploy/")
      }

    } catch(e) {
      sendMessage("🛠❌ Build ${repositoryName} №${env.BUILD_NUMBER}: Error ${imageTag} ${e}")
      throw e
    }
}

def sendChangeLogs() {
    def commitMessages = ""
    def changeLogSets = currentBuild.changeSets
    for (int i = 0; i < changeLogSets.size(); i++) {
        def entries = changeLogSets[i].items
        for (int j = 0; j < entries.length; j++) {
            def entry = entries[j]
            commitMessages = commitMessages + "\n> ${entry.author}: ${entry.msg} "
        }
    }
    return commitMessages
}

def sendMessage(message) {
    //sh(returnStdout: false, script: "curl -X POST -H 'Content-Type: application/json' -d '{\"chat_id\": \"${chatId}\", \"text\": \"${message}\", \"disable_notification\": true}' https://api.telegram.org/bot${token}/sendMessage")
}
