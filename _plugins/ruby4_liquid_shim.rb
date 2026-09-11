# ponytail: local-only shim. Ruby >=3.2 removed String#tainted?/#untaint;
# liquid 4.0.3 (pinned by the github-pages gem) still calls them. GitHub
# Pages builds with --safe (plugins disabled) so this never runs in prod.
# Remove once github-pages/jekyll ships a liquid version that doesn't call these.
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def untaint
      self
    end
  end
end
